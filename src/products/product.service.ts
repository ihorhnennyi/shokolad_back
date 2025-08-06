import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateProductDto } from './dto/create-product.dto'
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

	async findAll(): Promise<Product[]> {
		return this.model.find().populate('category').sort({ createdAt: -1 })
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
}
