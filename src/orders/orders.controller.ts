import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common'
import {
	ApiBadRequestResponse,
	ApiNotFoundResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { OrderService } from './orders.service'
import { Order } from './schemas/order.schema'

@ApiTags('Замовлення')
@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Post()
	@ApiOperation({ summary: 'Створити замовлення' })
	@ApiResponse({ status: 201, type: Order })
	@ApiBadRequestResponse({ description: 'Невірні дані для створення' })
	create(@Body() dto: CreateOrderDto) {
		return this.orderService.create(dto)
	}

	@Get()
	@ApiOperation({ summary: 'Отримати всі замовлення' })
	@ApiResponse({ status: 200, type: [Order] })
	findAll() {
		return this.orderService.findAll()
	}

	@Get(':id')
	@ApiOperation({ summary: 'Отримати замовлення за ID' })
	@ApiParam({ name: 'id', description: 'ID замовлення' })
	@ApiResponse({ status: 200, type: Order })
	@ApiNotFoundResponse({ description: 'Замовлення не знайдено' })
	findOne(@Param('id') id: string) {
		return this.orderService.findById(id)
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Оновити замовлення' })
	@ApiParam({ name: 'id', description: 'ID замовлення' })
	@ApiResponse({ status: 200, type: Order })
	@ApiNotFoundResponse({ description: 'Замовлення не знайдено' })
	update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
		return this.orderService.update(id, dto)
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Видалити замовлення' })
	@ApiParam({ name: 'id', description: 'ID замовлення' })
	@ApiResponse({ status: 200, description: 'Замовлення видалено' })
	@ApiNotFoundResponse({ description: 'Замовлення не знайдено' })
	remove(@Param('id') id: string) {
		return this.orderService.remove(id)
	}
}
