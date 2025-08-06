import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import ExcelJS from 'exceljs'
import { Response } from 'express'
import * as fs from 'fs'
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

	async exportToExcel(query: FilterProductDto, res: Response): Promise<void> {
		const { limit = '1000', page = '1', category, isActive, search } = query

		const filters: any = {}
		if (category) filters.category = category
		if (isActive !== undefined) filters.isActive = isActive
		if (search) filters.name = { $regex: search, $options: 'i' }

		const products = await this.model
			.find(filters)
			.populate('category')
			.sort({ createdAt: -1 })
			.limit(parseInt(limit))

		const workbook = new ExcelJS.Workbook()
		const worksheet = workbook.addWorksheet('Products')

		worksheet.columns = [
			{ header: 'Назва', key: 'name', width: 30 },
			{ header: 'Ціна', key: 'price', width: 10 },
			{ header: 'Категорія', key: 'category', width: 20 },
			{ header: 'Активний', key: 'isActive', width: 10 },
			{ header: 'Дата створення', key: 'createdAt', width: 20 },
		]

		products.forEach(product => {
			worksheet.addRow({
				name: product.name,
				price: product.price,
				category:
					typeof product.category === 'object' && 'name' in product.category
						? (product.category as any).name
						: '',
				isActive: product.isActive ? 'Так' : 'Ні',
				createdAt: product.createdAt.toLocaleString('uk-UA'),
			})
		})

		res.setHeader(
			'Content-Type',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		)
		res.setHeader('Content-Disposition', 'attachment; filename=products.xlsx')

		await workbook.xlsx.write(res)
		res.end()
	}

	async importFromExcel(
		filePath: string
	): Promise<{ created: number; skipped: number }> {
		const workbook = new ExcelJS.Workbook()
		await workbook.xlsx.readFile(filePath)

		const worksheet = workbook.getWorksheet(1)
		if (!worksheet) {
			throw new Error('Не удалось получить лист Excel')
		}

		let created = 0
		let skipped = 0

		for (let i = 2; i <= worksheet.rowCount; i++) {
			const row = worksheet.getRow(i)
			const rowValues = row.values as any[]
			const [name, price, categoryName, isActive] = rowValues.slice(1)

			if (!name || !price) {
				skipped++
				continue
			}

			const category = await this.model.db
				.collection('categories')
				.findOne({ name: categoryName })

			await this.model.create({
				name: String(name),
				price: parseFloat(price),
				isActive: String(isActive).trim().toLowerCase() === 'так',
				category: category?._id || null,
			})

			created++
		}

		fs.unlinkSync(filePath)
		return { created, skipped }
	}
}
