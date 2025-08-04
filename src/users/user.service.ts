import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcryptjs'
import { Model, Types } from 'mongoose'

import { UserRole } from 'src/common/enums/role.enum'
import { CreateUserDto } from './dto/create-user.dto'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<UserDocument>
	) {}

	async findByEmail(email: string): Promise<UserDocument | null> {
		return this.userModel.findOne({ email })
	}

	async create(dto: CreateUserDto): Promise<UserDocument> {
		const existing = await this.findByEmail(dto.email)
		if (existing) {
			throw new BadRequestException('Користувач з такою поштою вже існує')
		}

		const hashedPassword = await bcrypt.hash(dto.password, 10)
		const user = new this.userModel({
			email: dto.email,
			password: hashedPassword,
			role: dto.role || UserRole.MANAGER,
		})

		return user.save()
	}

	async findAll(): Promise<UserDocument[]> {
		return this.userModel.find()
	}

	async findById(id: string): Promise<UserDocument> {
		if (!Types.ObjectId.isValid(id)) {
			throw new BadRequestException('Некоректний формат ID користувача')
		}

		const user = await this.userModel.findById(id)
		if (!user) {
			throw new NotFoundException('Користувача не знайдено')
		}

		return user
	}
}
