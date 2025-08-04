import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { Category, CategoryDocument } from './schemas/category.schema'

@Injectable()
export class CategoriesService {
	constructor(
		@InjectModel(Category.name)
		private categoryModel: Model<CategoryDocument>
	) {}

	async create(dto: CreateCategoryDto): Promise<Category> {
		return this.categoryModel.create(dto)
	}

	async findAll(): Promise<Category[]> {
		return this.categoryModel.find()
	}

	async findById(id: string): Promise<Category> {
		const category = await this.categoryModel.findById(id)
		if (!category) throw new NotFoundException('Категорія не знайдена')
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

	async remove(id: string) {
		return this.categoryModel.findByIdAndDelete(id)
	}
}
