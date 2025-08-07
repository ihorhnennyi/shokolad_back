import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto'
import { Order, OrderDocument } from './schemas/order.schema'

import { Product, ProductDocument } from '../products/schemas/product.schema'

@Injectable()
export class OrderService {
	constructor(
		@InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
		@InjectModel(Product.name)
		private readonly productModel: Model<ProductDocument>
	) {}

	async create(dto: CreateOrderDto): Promise<Order> {
		const productIds = dto.items.map(i => i.product)
		const products = await this.productModel
			.find({ _id: { $in: productIds } })
			.exec()

		if (products.length !== productIds.length) {
			throw new BadRequestException('Один или несколько товаров не найдены')
		}

		const total = dto.items.reduce((sum, item) => {
			const product = products.find(p => String(p._id) === String(item.product))

			return sum + (product ? product.price * item.quantity : 0)
		}, 0)

		const order = new this.orderModel({
			...dto,
			user: new Types.ObjectId(dto.user),
			total,
		})
		return order.save()
	}

	async findAll(): Promise<Order[]> {
		return this.orderModel
			.find()
			.populate('user')
			.populate('items.product')
			.exec()
	}

	async findById(id: string): Promise<Order> {
		const order = await this.orderModel
			.findById(id)
			.populate('user')
			.populate('items.product')
			.exec()
		if (!order) throw new NotFoundException('Замовлення не знайдено')
		return order
	}

	async update(id: string, dto: UpdateOrderDto): Promise<Order> {
		const order = await this.orderModel.findById(id)
		if (!order) throw new NotFoundException('Замовлення не знайдено')

		let total = order.total
		if (dto.items) {
			const productIds = dto.items.map(i => i.product)
			const products = await this.productModel
				.find({ _id: { $in: productIds } })
				.exec()

			if (products.length !== productIds.length) {
				throw new BadRequestException('Один или несколько товаров не найдены')
			}

			total = dto.items.reduce((sum, item) => {
				const product = products.find(
					p => String(p._id) === String(item.product)
				)

				return sum + (product ? product.price * (item.quantity || 1) : 0)
			}, 0)
		}

		const updated = await this.orderModel
			.findByIdAndUpdate(id, { ...dto, total }, { new: true })
			.populate('user')
			.populate('items.product')
			.exec()

		if (!updated) throw new NotFoundException('Не вдалося оновити замовлення')
		return updated
	}

	async remove(id: string): Promise<{ deleted: boolean }> {
		const res = await this.orderModel.findByIdAndDelete(id).exec()
		if (!res) throw new NotFoundException('Замовлення не знайдено')
		return { deleted: true }
	}
}
