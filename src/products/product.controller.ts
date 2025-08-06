import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
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
import { Roles } from 'src/common/decorators/roles.decorator'
import { UserRole } from 'src/common/enums/role.enum'
import { RolesGuard } from 'src/common/guards/roles.guard'
import { CreateProductDto } from './dto/create-product.dto'
import { FilterProductDto } from './dto/filter-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductService } from './product.service'
import { Product } from './schemas/product.schema'

@ApiTags('Продукти')
@Controller('products')
export class ProductController {
	constructor(private readonly service: ProductService) {}

	@Post()
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiOperation({
		summary: 'Створити продукт (лише для адміністратора)',
		description:
			'Цей маршрут дозволяє створити новий продукт. Доступний лише адміністраторам.',
	})
	@ApiResponse({ status: 201, type: Product, description: 'Продукт створено' })
	@ApiUnauthorizedResponse({ description: 'Користувач не авторизований' })
	@ApiForbiddenResponse({ description: 'Доступ лише для адміністратора' })
	@ApiBadRequestResponse({ description: 'Некоректні дані продукту' })
	create(@Body() dto: CreateProductDto) {
		return this.service.create(dto)
	}

	@Get()
	@ApiOperation({
		summary: 'Отримати продукти з фільтрацією, пошуком та пагінацією',
	})
	@ApiResponse({
		status: 200,
		schema: {
			example: {
				items: [
					{
						_id: '64f...',
						name: 'Шоколад чорний',
						price: 100,
					},
				],
				totalCount: 24,
				totalPages: 3,
				currentPage: 1,
			},
		},
	})
	findAll(@Query() query: FilterProductDto) {
		return this.service.findAll(query)
	}

	@Get(':id')
	@ApiOperation({
		summary: 'Отримати продукт за ID',
		description: 'Повертає продукт за вказаним ідентифікатором.',
	})
	@ApiResponse({ status: 200, type: Product, description: 'Продукт знайдено' })
	@ApiNotFoundResponse({ description: 'Продукт не знайдено' })
	findById(@Param('id') id: string) {
		return this.service.findById(id)
	}

	@Patch(':id')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiOperation({
		summary: 'Оновити продукт (лише для адміністратора)',
		description: 'Оновлює дані продукту за ID.',
	})
	@ApiResponse({ status: 200, type: Product, description: 'Продукт оновлено' })
	@ApiNotFoundResponse({ description: 'Продукт не знайдено' })
	@ApiForbiddenResponse({ description: 'Доступ лише для адміністратора' })
	update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
		return this.service.update(id, dto)
	}

	@Delete(':id')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiOperation({
		summary: 'Видалити продукт (лише для адміністратора)',
		description: 'Видаляє продукт за ID.',
	})
	@ApiResponse({ status: 200, description: 'Продукт видалено' })
	@ApiNotFoundResponse({ description: 'Продукт не знайдено' })
	@ApiForbiddenResponse({ description: 'Доступ лише для адміністратора' })
	remove(@Param('id') id: string) {
		return this.service.remove(id)
	}
}
