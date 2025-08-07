import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export enum OrderStatus {
	PENDING = 'pending',
	PROCESSING = 'processing',
	COMPLETED = 'completed',
	CANCELLED = 'cancelled',
}

@Schema({ _id: false })
export class OrderHistoryEntry {
	@Prop({ type: String, enum: OrderStatus, required: true })
	status: OrderStatus

	@Prop({ type: String })
	comment?: string

	@Prop({ type: Types.ObjectId, ref: 'User' })
	updatedBy?: Types.ObjectId

	@Prop({ type: Date, default: Date.now })
	updatedAt: Date
}

@Schema({ timestamps: true })
export class Order {
	@Prop({ type: Types.ObjectId, ref: 'User', required: true })
	user: Types.ObjectId

	@Prop([
		{
			product: { type: Types.ObjectId, ref: 'Product', required: true },
			quantity: { type: Number, required: true },
		},
	])
	items: {
		product: Types.ObjectId
		quantity: number
	}[]

	@Prop({ required: true })
	deliveryAddress: string

	@Prop({ required: true })
	customerName: string

	@Prop({ required: true })
	customerPhone: string

	@Prop({ required: true })
	total: number

	@Prop({
		type: String,
		enum: OrderStatus,
		default: OrderStatus.PENDING,
	})
	status: OrderStatus

	@Prop({ type: [OrderHistoryEntry], default: [] })
	history: OrderHistoryEntry[]
}

export type OrderDocument = Order & Document
export const OrderSchema = SchemaFactory.createForClass(Order)
