import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

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
	total: number

	@Prop({
		type: String,
		enum: ['pending', 'processing', 'completed', 'cancelled'],
		default: 'pending',
	})
	status: string
}

export type OrderDocument = Order & Document
export const OrderSchema = SchemaFactory.createForClass(Order)
