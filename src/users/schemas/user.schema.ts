import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

@Schema({ timestamps: true })
export class User {
	@Prop({ required: true, unique: true })
	email: string

	@Prop({ required: true })
	password: string

	@Prop({ required: true })
	role: string
}

export type UserDocument = User &
	Document & {
		_id: Types.ObjectId
	}

export const UserSchema = SchemaFactory.createForClass(User)
