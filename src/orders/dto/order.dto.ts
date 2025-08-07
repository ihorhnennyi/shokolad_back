import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsEnum,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator'
import { OrderStatus } from '../schemas/order.schema'

export class OrderItemDto {
	@ApiProperty({ example: '64fabc123...', description: 'ID продукту' })
	@IsMongoId()
	product: string

	@ApiProperty({ example: 2, description: 'Кількість' })
	@IsNumber()
	quantity: number
}

export class CreateOrderDto {
	@ApiProperty({ example: '64fa123...', description: 'ID користувача' })
	@IsMongoId()
	user: string

	@ApiProperty({
		description: 'Список товарів у замовленні',
		type: [OrderItemDto],
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => OrderItemDto)
	items: OrderItemDto[]

	@ApiProperty({
		example: 'Київ, вул. Хрещатик, 10',
		description: 'Адреса доставки',
	})
	@IsString()
	@IsNotEmpty()
	deliveryAddress: string

	@ApiProperty({ example: 'Ігор', description: "Ім'я замовника" })
	@IsString()
	@IsNotEmpty()
	customerName: string

	@ApiProperty({ example: '+380991234567', description: 'Телефон замовника' })
	@IsString()
	@IsNotEmpty()
	customerPhone: string
}

export class UpdateOrderItemDto {
	@ApiPropertyOptional({ example: '64fabc123...', description: 'ID продукту' })
	@IsOptional()
	@IsMongoId()
	product?: string

	@ApiPropertyOptional({ example: 2, description: 'Кількість' })
	@IsOptional()
	@IsNumber()
	quantity?: number
}

export class UpdateOrderDto {
	@ApiPropertyOptional({
		type: [UpdateOrderItemDto],
		description: 'Список товарів',
	})
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UpdateOrderItemDto)
	items?: UpdateOrderItemDto[]

	@ApiPropertyOptional({
		example: 'Київ, вул. Хрещатик, 10',
		description: 'Адреса доставки',
	})
	@IsOptional()
	@IsString()
	deliveryAddress?: string

	@ApiPropertyOptional({ example: 'Ігор', description: "Ім'я замовника" })
	@IsOptional()
	@IsString()
	customerName?: string

	@ApiPropertyOptional({
		example: '+380991234567',
		description: 'Телефон замовника',
	})
	@IsOptional()
	@IsString()
	customerPhone?: string

	@ApiPropertyOptional({
		example: OrderStatus.COMPLETED,
		description: 'Статус замовлення',
		enum: OrderStatus,
	})
	@IsOptional()
	@IsEnum(OrderStatus)
	status?: OrderStatus
}
