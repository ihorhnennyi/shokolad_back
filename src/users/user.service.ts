import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcryptjs'
import { Model } from 'mongoose'
import { UserRole } from 'src/common/enums/role.enum'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UserService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async findByEmail(email: string) {
		return this.userModel.findOne({ email })
	}

	async create(
		name: string,
		email: string,
		password: string,
		role: UserRole = UserRole.MANAGER
	) {
		const hashedPassword = await bcrypt.hash(password, 10)
		return this.userModel.create({
			name,
			email,
			password: hashedPassword,
			role,
		})
	}

	async findAll() {
		return this.userModel.find()
	}
}
