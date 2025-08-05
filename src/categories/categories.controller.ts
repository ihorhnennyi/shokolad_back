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
		description: `Цей маршрут дозволяє створити нову категорію. Доступний лише адміністраторам.`,
	})
	@ApiResponse({
		status: 201,
		description: 'Категорію створено',
		type: Category,
	})
	@ApiUnauthorizedResponse({ description: 'Користувач не авторизований' })
	@ApiForbiddenResponse({ description: 'Доступ лише для адміністратора' })
	@ApiBadRequestResponse({ description: 'Некоректні дані категорії' })
	create(@Body() dto: CreateCategoryDto) {
		return this.service.create(dto)
	}

	@Get()
	@ApiOperation({
		summary: 'Отримати всі категорії',
		description: 'Повертає список усіх доступних категорій.',
	})
	@ApiResponse({
		status: 200,
		description: 'Категорії отримано',
		type: [Category],
	})
	findAll() {
		return this.service.findAll()
	}

	@Get(':id')
	@ApiOperation({
		summary: 'Отримати категорію за ID',
		description: 'Повертає категорію за її унікальним ідентифікатором.',
	})
	@ApiResponse({
		status: 200,
		description: 'Категорію знайдено',
		type: Category,
	})
	@ApiNotFoundResponse({ description: 'Категорію не знайдено' })
	findById(@Param('id') id: string) {
		return this.service.findById(id)
	}

	@Patch(':id')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiOperation({
		summary: 'Оновити категорію (лише для адміністратора)',
		description: 'Оновлює назву або опис категорії за ID.',
	})
	@ApiResponse({
		status: 200,
		description: 'Категорію оновлено',
		type: Category,
	})
	@ApiNotFoundResponse({ description: 'Категорію не знайдено' })
	@ApiForbiddenResponse({ description: 'Доступ лише для адміністратора' })
	update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
		return this.service.update(id, dto)
	}

	@Delete(':id')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiOperation({
		summary: 'Видалити категорію (лише для адміністратора)',
		description: 'Видаляє категорію за її ID. Також видаляє всі підкатегорії.',
	})
	@ApiResponse({ status: 200, description: 'Категорію видалено' })
	@ApiNotFoundResponse({ description: 'Категорію не знайдено' })
	@ApiForbiddenResponse({ description: 'Доступ лише для адміністратора' })
	remove(@Param('id') id: string) {
		return this.service.remove(id)
	}

	@Post(':parentId/subcategory')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiOperation({
		summary: 'Створити підкатегорію (лише для адміністратора)',
		description: 'Додає підкатегорію до вказаної батьківської категорії.',
	})
	@ApiResponse({
		status: 201,
		description: 'Підкатегорію створено',
		type: Category,
	})
	@ApiNotFoundResponse({ description: 'Батьківську категорію не знайдено' })
	@ApiForbiddenResponse({ description: 'Доступ лише для адміністратора' })
	@ApiBadRequestResponse({ description: 'Некоректні дані підкатегорії' })
	async createSubcategory(
		@Param('parentId') parentId: string,
		@Body() dto: CreateCategoryDto
	) {
		const parent = await this.service.findById(parentId)
		if (!parent) {
			throw new NotFoundException('Батьківську категорію не знайдено')
		}

		return this.service.create({ ...dto, parent: parentId })
	}

	@Get('parent/:parentId')
	@ApiOperation({
		summary: 'Отримати підкатегорії за ID батьківської категорії',
		description:
			'Повертає всі підкатегорії для заданої батьківської категорії.',
	})
	@ApiResponse({
		status: 200,
		description: 'Підкатегорії отримано',
		type: [Category],
	})
	@ApiNotFoundResponse({ description: 'Батьківську категорію не знайдено' })
	findChildren(@Param('parentId') parentId: string) {
		return this.service.findChildren(parentId)
	}

	@Get('tree')
	@ApiOperation({
		summary: 'Отримати дерево категорій',
		description: 'Повертає всі категорії у вигляді дерева з підкатегоріями.',
	})
	@ApiResponse({
		status: 200,
		description: 'Дерево категорій отримано',
	})
	findTree() {
		return this.service.findTree()
	}
}
