import { ApiPropertyOptional } from '@nestjs/swagger'
import {
	IsEnum,
	IsMongoId,
	IsNumberString,
	IsOptional,
	IsString,
} from 'class-validator'
import { OrderStatus } from '../schemas/order.schema'

export class FilterOrdersDto {
	@ApiPropertyOptional({ enum: OrderStatus, description: 'Статус заказа' })
	@IsOptional()
	@IsEnum(OrderStatus)
	status?: OrderStatus

	@ApiPropertyOptional({ description: 'ID пользователя' })
	@IsOptional()
	@IsMongoId()
	user?: string

	@ApiPropertyOptional({ description: 'Поиск по имени заказчика' })
	@IsOptional()
	@IsString()
	customerName?: string

	@ApiPropertyOptional({ description: 'Поиск по номеру телефона' })
	@IsOptional()
	@IsString()
	customerPhone?: string

	@ApiPropertyOptional({ description: 'Страница', default: 1 })
	@IsOptional()
	@IsNumberString()
	page?: string

	@ApiPropertyOptional({ description: 'Количество на странице', default: 20 })
	@IsOptional()
	@IsNumberString()
	limit?: string
}
