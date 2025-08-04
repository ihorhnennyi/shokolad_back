import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Param,
	Post,
	UseGuards,
} from '@nestjs/common'
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { JwtPayload } from 'src/auth/jwt.strategy'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
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
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Отримати список користувачів (тільки для адміністратора)',
		description: `Цей маршрут повертає перелік усіх зареєстрованих користувачів у системі. Доступ дозволено лише адміністраторам.

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
	@ApiUnauthorizedResponse({
		description: 'Користувач не авторизований (немає JWT токена)',
	})
	@ApiForbiddenResponse({
		description:
			'Доступ заборонено — лише адміністратор може переглядати користувачів',
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

	@Get('me')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Отримання власного профілю (для авторизованого користувача)',
		description: `Цей маршрут дозволяє авторизованому користувачу отримати власну інформацію профілю.

Приклад відповіді:
{
  "id": "64d8f3c3e034d1231236ef8a",
  "email": "user@example.com",
  "role": "manager"
}`,
	})
	@ApiResponse({
		status: 200,
		description: 'Інформацію про користувача успішно отримано',
		type: UserDto,
	})
	@ApiUnauthorizedResponse({
		description: 'Користувач не авторизований (немає JWT токена)',
	})
	async getMe(@CurrentUser() user: JwtPayload): Promise<UserDto> {
		const found = await this.userService.findById(user.sub)
		if (!found) throw new NotFoundException('Користувача не знайдено')
		return {
			id: found._id.toString(),
			email: found.email,
			role: found.role as UserRole,
		}
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Отримання користувача за ID (тільки для адміністратора)',
		description: `Цей маршрут дозволяє адміністратору отримати інформацію про конкретного користувача за його ID.

Приклад запиту:
GET /users/64d8f3c3e034d1231236ef8a

Приклад відповіді:
{
  "id": "64d8f3c3e034d1231236ef8a",
  "email": "user@example.com",
  "role": "manager"
}`,
	})
	@ApiResponse({
		status: 200,
		description: 'Користувача успішно знайдено',
		type: UserDto,
	})
	@ApiUnauthorizedResponse({
		description: 'Користувач не авторизований (немає JWT токена)',
	})
	@ApiForbiddenResponse({
		description:
			'Доступ заборонено — лише адміністратор може переглядати користувачів',
	})
	@ApiBadRequestResponse({
		description: 'Некоректний формат ID користувача',
	})
	@ApiResponse({
		status: 404,
		description: 'Користувача з таким ID не знайдено',
	})
	async getById(@Param('id') id: string): Promise<UserDto> {
		const user = await this.userService.findById(id)
		if (!user) throw new NotFoundException('Користувача не знайдено')

		return {
			id: user._id.toString(),
			email: user.email,
			role: user.role as UserRole,
		}
	}
}
