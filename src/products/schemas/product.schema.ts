import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'
import { Category } from 'src/categories/schemas/category.schema'

export type ProductDocument = Product &
	Document & {
		createdAt: Date
		updatedAt: Date
	}

@Schema({ timestamps: true })
export class Product {
	@Prop()
	name: string

	@Prop()
	price: number

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
	category: Category | mongoose.Types.ObjectId

	@Prop({ default: true })
	isActive: boolean
}

export const ProductSchema = SchemaFactory.createForClass(Product)
