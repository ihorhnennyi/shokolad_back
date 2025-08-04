import {
	Body,
	Controller,
	Delete,
	Get,
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
	ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { RolesGuard } from 'src/common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { UserRole } from '../common/enums/role.enum'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { Category } from './schemas/category.schema'

@ApiTags('Категорії')
@Controller('categories')
export class CategoriesController {
	constructor(private readonly service: CategoriesService) {}

	@Post()
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiOperation({
		summary: 'Створити категорію (лише для адміністратора)',
		description: `Цей маршрут дозволяє створити нову категорію. Доступний лише адміністраторам.

Приклад запиту:
POST /categories
{
  "name": "Новини",
  "description": "Опис категорії"
}`,
	})
	@ApiResponse({
		status: 201,
		description: 'Категорію успішно створено',
		type: Category,
	})
	@ApiUnauthorizedResponse({
		description: 'Користувач не авторизований',
	})
	@ApiForbiddenResponse({
		description: 'Лише адміністратор може створювати категорії',
	})
	@ApiBadRequestResponse({
		description: 'Некоректні дані категорії',
	})
	create(@Body() dto: CreateCategoryDto) {
		return this.service.create(dto)
	}

	@Get()
	@ApiOperation({
		summary: 'Отримати всі категорії',
		description: 'Цей маршрут повертає список усіх доступних категорій.',
	})
	@ApiResponse({
		status: 200,
		description: 'Список категорій отримано успішно',
		type: [Category],
	})
	findAll() {
		return this.service.findAll()
	}

	@Get(':id')
	@ApiOperation({
		summary: 'Отримати категорію за ID',
		description: 'Цей маршрут повертає одну категорію за її ідентифікатором.',
	})
	@ApiResponse({
		status: 200,
		description: 'Категорію знайдено успішно',
		type: Category,
	})
	@ApiNotFoundResponse({
		description: 'Категорію не знайдено',
	})
	findById(@Param('id') id: string) {
		return this.service.findById(id)
	}

	@Patch(':id')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiOperation({
		summary: 'Оновити категорію за ID (лише для адміністратора)',
		description: `Цей маршрут дозволяє оновити назву або опис категорії.`,
	})
	@ApiResponse({
		status: 200,
		description: 'Категорію успішно оновлено',
		type: Category,
	})
	@ApiNotFoundResponse({
		description: 'Категорію не знайдено',
	})
	@ApiForbiddenResponse({
		description: 'Лише адміністратор може оновлювати категорії',
	})
	update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
		return this.service.update(id, dto)
	}

	@Delete(':id')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiOperation({
		summary: 'Видалити категорію за ID (лише для адміністратора)',
		description:
			'Цей маршрут дозволяє видалити категорію за її ідентифікатором.',
	})
	@ApiResponse({
		status: 200,
		description: 'Категорію успішно видалено',
	})
	@ApiNotFoundResponse({
		description: 'Категорію не знайдено',
	})
	@ApiForbiddenResponse({
		description: 'Лише адміністратор може видаляти категорії',
	})
	remove(@Param('id') id: string) {
		return this.service.remove(id)
	}
}
