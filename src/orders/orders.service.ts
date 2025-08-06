import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { Order, OrderDocument } from './schemas/order.schema'

@Injectable()
export class OrderService {
	constructor(
		@InjectModel(Order.name)
		private readonly orderModel: Model<OrderDocument>
	) {}

	async create(dto: CreateOrderDto): Promise<Order> {
		const order = new this.orderModel(dto)
		return order.save()
	}

	async findAll(): Promise<Order[]> {
		return this.orderModel.find().populate('items.productId').exec()
	}

	async findById(id: string): Promise<Order> {
		const order = await this.orderModel
			.findById(id)
			.populate('items.productId')
			.exec()

		if (!order) throw new NotFoundException('Замовлення не знайдено')
		return order
	}

	async update(id: string, dto: UpdateOrderDto): Promise<Order> {
		const updated = await this.orderModel
			.findByIdAndUpdate(id, dto, { new: true })
			.populate('items.productId')
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
