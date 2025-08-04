import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { Roles } from 'src/common/decorators/roles.decorator'
import { UserRole } from 'src/common/enums/role.enum'
import { RolesGuard } from 'src/common/guards/roles.guard'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateUserDto } from './dto/create-user.dto'
import { UserDto } from './dto/user.dto'
import { UserService } from './user.service'

@ApiTags('Користувачі')
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@ApiOperation({
		summary: 'Отримати список користувачів',
		description: `Цей маршрут повертає перелік усіх зареєстрованих користувачів у системі.

Приклад відповіді:
[
  {
    "id": "64d8f3c3e034d1231236ef8a",
    "email": "admin@example.com",
    "role": "admin"
  },
  ...
]`,
	})
	@ApiResponse({
		status: 200,
		description: 'Список користувачів успішно отримано',
		type: [UserDto],
	})
	async getAll(): Promise<UserDto[]> {
		const users = await this.userService.findAll()
		return users.map(user => ({
			id: user._id.toString(),
			email: user.email,
			role: user.role as UserRole,
		}))
	}

	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Створення нового користувача (тільки для адміністратора)',
		description: `Цей маршрут дозволяє створити нового користувача з email, паролем та роллю. Доступний лише адміністраторам.

Приклад запиту:
POST /users

{
  "email": "newuser@example.com",
  "password": "password123",
  "role": "manager"
}`,
	})
	@ApiResponse({
		status: 201,
		description: 'Користувача успішно створено',
		type: UserDto,
	})
	@ApiUnauthorizedResponse({
		description: 'Користувач не авторизований (немає JWT токена)',
	})
	@ApiForbiddenResponse({
		description:
			'Доступ заборонено — лише адміністратор може створювати користувачів',
	})
	@ApiBadRequestResponse({
		description:
			'Користувач з такою поштою вже існує або передані некоректні дані',
	})
	async create(@Body() dto: CreateUserDto): Promise<UserDto> {
		const user = await this.userService.create(dto)
		return {
			id: user._id.toString(),
			email: user.email,
			role: user.role as UserRole,
		}
	}
}
