import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common'
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOperation,
	ApiParam,
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
import { UpdateMeDto } from './dto/update-me.dto'
import { UpdateUserStatusDto } from './dto/update-user-status.dto'
import { UpdateUserDto } from './dto/update-user.dto'
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

	@Delete(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Видалити користувача (тільки для адміністратора)',
		description: `Адміністратор може видалити будь-якого користувача за ID.

Приклад:
DELETE /users/64d8f3c3e034d1231236ef8a`,
	})
	@ApiParam({
		name: 'id',
		description: 'ID користувача',
		example: '64d8f3c3e034d1231236ef8a',
	})
	@ApiResponse({ status: 200, description: 'Користувача успішно видалено' })
	@ApiUnauthorizedResponse({ description: 'Користувач не авторизований' })
	@ApiForbiddenResponse({
		description:
			'Доступ заборонено — лише адміністратор може видаляти користувачів',
	})
	@ApiNotFoundResponse({ description: 'Користувача не знайдено' })
	async delete(@Param('id') id: string): Promise<{ message: string }> {
		await this.userService.deleteById(id)
		return { message: 'Користувача успішно видалено' }
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Оновити користувача (тільки для адміністратора)',
		description: `Адміністратор може оновити email, роль або пароль будь-якого користувача.`,
	})
	@ApiParam({ name: 'id', description: 'ID користувача' })
	@ApiResponse({
		status: 200,
		description: 'Користувача оновлено',
		type: UserDto,
	})
	@ApiNotFoundResponse({ description: 'Користувача не знайдено' })
	async updateUserAsAdmin(
		@Param('id') id: string,
		@Body() dto: UpdateUserDto
	): Promise<UserDto> {
		const user = await this.userService.updateById(id, dto)
		return {
			id: user._id.toString(),
			email: user.email,
			role: user.role as UserRole,
		}
	}

	@Patch('me')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Оновити свій профіль',
		description: `Користувач може оновити свій email або пароль.`,
	})
	@ApiResponse({ status: 200, description: 'Профіль оновлено', type: UserDto })
	async updateMe(
		@CurrentUser() user: JwtPayload,
		@Body() dto: UpdateMeDto
	): Promise<UserDto> {
		const updated = await this.userService.updateMe(user.sub, dto)
		return {
			id: updated._id.toString(),
			email: updated.email,
			role: updated.role as UserRole,
		}
	}

	@Patch(':id/deactivate')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Деактивувати користувача (тільки для адміністратора)',
		description: `Цей маршрут дозволяє адміністратору зробити користувача неактивним.`,
	})
	@ApiResponse({
		status: 200,
		description: 'Користувача успішно деактивовано',
		type: UserDto,
	})
	@ApiUnauthorizedResponse({ description: 'Не авторизовано' })
	@ApiForbiddenResponse({ description: 'Доступ заборонено' })
	@ApiBadRequestResponse({
		description: 'Некоректний ID або користувача не знайдено',
	})
	async deactivate(@Param('id') id: string): Promise<UserDto> {
		const user = await this.userService.deactivate(id)
		return {
			id: user._id.toString(),
			email: user.email,
			role: user.role as UserRole,
		}
	}

	@Patch(':id/activate')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiBearerAuth()
	@ApiOperation({
		summary:
			'Змінити статус активності користувача (тільки для адміністратора)',
		description: `Цей маршрут дозволяє адміністратору активувати або деактивувати користувача.`,
	})
	@ApiResponse({
		status: 200,
		description: 'Статус користувача успішно оновлено',
		type: UserDto,
	})
	@ApiUnauthorizedResponse({
		description: 'Користувач не авторизований',
	})
	@ApiForbiddenResponse({
		description: 'Доступ заборонено — лише адміністратор може змінювати статус',
	})
	@ApiNotFoundResponse({
		description: 'Користувача не знайдено',
	})
	async updateStatus(
		@Param('id') id: string,
		@Body() dto: UpdateUserStatusDto
	): Promise<UserDto> {
		const user = await this.userService.updateStatus(id, dto.isActive)
		return {
			id: user._id.toString(),
			email: user.email,
			role: user.role as UserRole,
		}
	}
}
