import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { UserRole } from 'src/common/enums/role.enum'

export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User {
	@Prop({ required: true })
	name: string

	@Prop({ required: true, unique: true })
	email: string

	@Prop({ required: true })
	password: string

	@Prop({ enum: UserRole, default: UserRole.MANAGER })
	role: UserRole
}

export const UserSchema = SchemaFactory.createForClass(User)
