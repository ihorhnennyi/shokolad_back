import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateProductDto } from './dto/create-product.dto'
import { FilterProductDto } from './dto/filter-product.dto'
import { PaginatedResponseDto } from './dto/paginated-response.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { Product, ProductDocument } from './schemas/product.schema'

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(Product.name) private readonly model: Model<ProductDocument>
	) {}

	async create(dto: CreateProductDto): Promise<Product> {
		return this.model.create(dto)
	}

	async findById(id: string): Promise<Product> {
		const product = await this.model.findById(id).populate('category')
		if (!product) throw new NotFoundException('Продукт не знайдено')
		return product
	}

	async update(id: string, dto: UpdateProductDto): Promise<Product> {
		const updated = await this.model.findByIdAndUpdate(id, dto, { new: true })
		if (!updated) throw new NotFoundException('Продукт не знайдено')
		return updated
	}

	async remove(id: string): Promise<Product> {
		const deleted = await this.model.findByIdAndDelete(id)
		if (!deleted) throw new NotFoundException('Продукт не знайдено')
		return deleted
	}

	async findAll(
		query: FilterProductDto
	): Promise<PaginatedResponseDto<Product>> {
		const { limit = '10', page = '1', category, isActive, search } = query

		const filters: any = {}
		if (category) filters.category = category
		if (isActive !== undefined) filters.isActive = isActive
		if (search) filters.name = { $regex: search, $options: 'i' }

		const limitNum = parseInt(limit)
		const pageNum = parseInt(page)
		const skip = (pageNum - 1) * limitNum

		const [items, totalCount] = await Promise.all([
			this.model
				.find(filters)
				.populate('category')
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limitNum),
			this.model.countDocuments(filters),
		])

		return {
			items,
			totalCount,
			totalPages: Math.ceil(totalCount / limitNum),
			currentPage: pageNum,
		}
	}
}
