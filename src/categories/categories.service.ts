import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryOrderDto } from './dto/update-category-order.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { CategoryWithChildren } from './interfaces/category-with-children.interface'
import { Category, CategoryDocument } from './schemas/category.schema'

@Injectable()
export class CategoriesService {
	constructor(
		@InjectModel(Category.name)
		private readonly categoryModel: Model<CategoryDocument>
	) {}

	async create(dto: CreateCategoryDto): Promise<Category> {
		if (dto.parent && !Types.ObjectId.isValid(dto.parent)) {
			throw new NotFoundException('Некоректний ID батьківської категорії')
		}

		if (dto.parent) {
			const parentExists = await this.categoryModel.exists({ _id: dto.parent })
			if (!parentExists) {
				throw new NotFoundException('Батьківську категорію не знайдено')
			}
		}

		return this.categoryModel.create(dto)
	}

	async findAll(): Promise<Category[]> {
		return this.categoryModel.find().sort({ createdAt: -1 })
	}

	async findById(id: string): Promise<CategoryDocument> {
		const category = await this.categoryModel.findById(id)
		if (!category) throw new NotFoundException('Категорію не знайдено')
		return category
	}

	async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
		const category = await this.categoryModel.findByIdAndUpdate(id, dto, {
			new: true,
		})

		if (!category) {
			throw new NotFoundException('Категорія не знайдена')
		}

		return category
	}

	async remove(id: string): Promise<Category> {
		const category = await this.categoryModel.findByIdAndDelete(id)
		if (!category) {
			throw new NotFoundException('Категорія не знайдена')
		}

		await this.categoryModel.deleteMany({ parent: id })
		return category
	}

	async findChildren(parentId: string): Promise<Category[]> {
		if (!Types.ObjectId.isValid(parentId)) {
			throw new NotFoundException('Некоректний ID категорії')
		}
		return this.categoryModel.find({ parent: parentId })
	}

	async findTree(): Promise<CategoryWithChildren[]> {
		const categories = await this.categoryModel.find().lean()

		const categoryMap = new Map<string, CategoryWithChildren>()
		const roots: CategoryWithChildren[] = []

		for (const category of categories) {
			const id = (category._id as Types.ObjectId).toString()
			const parentId = category.parent
				? (category.parent as Types.ObjectId).toString()
				: undefined

			const preparedCategory: CategoryWithChildren = {
				_id: id,
				name: category.name,
				description: category.description,
				parent: parentId,
				children: [],
			}

			categoryMap.set(id, preparedCategory)
		}

		for (const category of categoryMap.values()) {
			if (category.parent) {
				const parent = categoryMap.get(category.parent)
				if (parent) {
					parent.children.push(category)
				}
			} else {
				roots.push(category)
			}
		}

		return roots
	}

	async updateOrder(
		id: string,
		dto: UpdateCategoryOrderDto
	): Promise<Category> {
		const category = await this.categoryModel.findByIdAndUpdate(
			id,
			{ order: dto.order },
			{ new: true }
		)
		if (!category) {
			throw new NotFoundException('Категорію не знайдено')
		}
		return category
	}

	async toggleActive(id: string): Promise<Category> {
		const category = await this.categoryModel.findById(id)
		if (!category) throw new NotFoundException('Категорію не знайдено')

		category.isActive = !category.isActive
		return category.save()
	}

	async search(query: string): Promise<Category[]> {
		if (!query) return []
		return this.categoryModel.find({
			name: { $regex: query, $options: 'i' },
		})
	}

	async getPath(id: string): Promise<Category[]> {
		if (!Types.ObjectId.isValid(id)) {
			throw new NotFoundException('Некоректний ID категорії')
		}

		const path: Category[] = []
		let current = await this.categoryModel.findById(id)

		while (current) {
			path.unshift(current)
			if (!current.parent) break
			current = await this.categoryModel.findById(current.parent)
		}

		if (!path.length) {
			throw new NotFoundException('Категорію не знайдено')
		}

		return path
	}

	async getStats() {
		const total = await this.categoryModel.countDocuments()
		const rootCount = await this.categoryModel.countDocuments({ parent: null })
		const childrenCount = await this.categoryModel.countDocuments({
			parent: { $ne: null },
		})

		const categories = await this.categoryModel.find().lean()

		const buildDepthMap = (
			categoryId: string,
			depth: number,
			map: Map<string, number>
		) => {
			map.set(categoryId, depth)
			for (const cat of categories) {
				if (cat.parent?.toString() === categoryId) {
					buildDepthMap(cat._id.toString(), depth + 1, map)
				}
			}
		}

		const depthMap = new Map<string, number>()
		for (const cat of categories) {
			if (!cat.parent) {
				buildDepthMap(cat._id.toString(), 1, depthMap)
			}
		}

		const maxDepth = Math.max(...Array.from(depthMap.values()), 0)

		return {
			total,
			rootCount,
			childrenCount,
			maxDepth,
		}
	}
}
