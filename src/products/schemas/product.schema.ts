import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type ProductDocument = Product & Document

@Schema({ timestamps: true })
export class Product {
	@Prop({ required: true })
	name: string

	@Prop()
	description?: string

	@Prop({ required: true })
	price: number

	@Prop()
	image?: string

	@Prop({ type: Types.ObjectId, ref: 'Category', required: true })
	category: Types.ObjectId

	@Prop({ default: true })
	isActive: boolean
}

export const ProductSchema = SchemaFactory.createForClass(Product)
