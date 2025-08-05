import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type CategoryDocument = Category & Document

@Schema({ timestamps: true })
export class Category {
	@Prop({ required: true })
	name: string

	@Prop()
	description?: string

	@Prop({ type: Types.ObjectId, ref: 'Category', default: null })
	parent?: Types.ObjectId

	@Prop({ type: Number, default: 0 })
	order: number

	@Prop({ default: true })
	isActive: boolean
}

export const CategorySchema = SchemaFactory.createForClass(Category)
