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

import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'
import { OrderService } from './orders.service'
import { Order } from './schemas/order.schema'

@ApiTags('Замовлення')
@Controller('orders')
export class OrderController {
	constructor(private readonly service: OrderService) {}

	@Post()
	@ApiOperation({
		summary: 'Створити замовлення',
		description: `Створює нове замовлення. Доступно всім користувачам (наприклад, клиент на сайті).`,
	})
	@ApiResponse({ status: 201, description: 'Замовлення створено', type: Order })
	@ApiBadRequestResponse({ description: 'Некоректні дані замовлення' })
	create(@Body() dto: CreateOrderDto) {
		return this.service.create(dto)
	}

	@Get()
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@ApiOperation({
		summary: 'Отримати всі замовлення',
		description:
			'Повертає список усіх замовлень. Доступно менеджеру та адміну.',
	})
	@ApiResponse({
		status: 200,
		description: 'Список замовлень отримано',
		type: [Order],
	})
	@ApiUnauthorizedResponse({ description: 'Користувач не авторизований' })
	@ApiForbiddenResponse({
		description: 'Доступ лише для менеджера або адміністратора',
	})
	findAll() {
		return this.service.findAll()
	}

	@Get(':id')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@ApiOperation({
		summary: 'Отримати замовлення за ID',
		description:
			'Повертає замовлення за унікальним ідентифікатором. Доступно менеджеру та адміну.',
	})
	@ApiResponse({ status: 200, description: 'Замовлення знайдено', type: Order })
	@ApiNotFoundResponse({ description: 'Замовлення не знайдено' })
	@ApiUnauthorizedResponse({ description: 'Користувач не авторизований' })
	@ApiForbiddenResponse({
		description: 'Доступ лише для менеджера або адміністратора',
	})
	findById(@Param('id') id: string) {
		return this.service.findById(id)
	}

	@Patch(':id')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@ApiOperation({
		summary: 'Оновити замовлення',
		description: 'Оновлює замовлення за ID. Доступно менеджеру та адміну.',
	})
	@ApiResponse({ status: 200, description: 'Замовлення оновлено', type: Order })
	@ApiNotFoundResponse({ description: 'Замовлення не знайдено' })
	@ApiUnauthorizedResponse({ description: 'Користувач не авторизований' })
	@ApiForbiddenResponse({
		description: 'Доступ лише для менеджера або адміністратора',
	})
	update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
		return this.service.update(id, dto)
	}

	@Delete(':id')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN)
	@ApiOperation({
		summary: 'Видалити замовлення',
		description: 'Видаляє замовлення за його ID. Доступно тільки адміну.',
	})
	@ApiResponse({ status: 200, description: 'Замовлення видалено' })
	@ApiNotFoundResponse({ description: 'Замовлення не знайдено' })
	@ApiUnauthorizedResponse({ description: 'Користувач не авторизований' })
	@ApiForbiddenResponse({ description: 'Доступ лише для адміністратора' })
	remove(@Param('id') id: string) {
		return this.service.remove(id)
	}

	@Patch(':id/status')
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(UserRole.ADMIN, UserRole.MANAGER)
	@ApiOperation({
		summary: 'Змінити статус замовлення',
		description: 'Оновлює статус замовлення (доступно менеджеру та адміну).',
	})
	@ApiResponse({ status: 200, description: 'Статус оновлено', type: Order })
	@ApiNotFoundResponse({ description: 'Замовлення не знайдено' })
	@ApiForbiddenResponse({
		description: 'Доступ лише для менеджера або адміністратора',
	})
	updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
		return this.service.updateStatus(id, dto)
	}
}
