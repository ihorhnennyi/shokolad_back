import { ApiProperty } from '@nestjs/swagger'
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
	@ApiProperty({ example: '64fabc123...', description: 'ID продукта' })
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
	@ApiProperty({
		example: '64fabc123...',
		description: 'ID продукта',
		required: false,
	})
	@IsOptional()
	@IsMongoId()
	product?: string

	@ApiProperty({ example: 2, description: 'Кількість', required: false })
	@IsOptional()
	@IsNumber()
	quantity?: number
}

export class UpdateOrderDto {
	@ApiProperty({ required: false, type: [UpdateOrderItemDto] })
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UpdateOrderItemDto)
	items?: UpdateOrderItemDto[]

	@ApiProperty({
		example: 'Київ, вул. Хрещатик, 10',
		description: 'Адреса доставки',
		required: false,
	})
	@IsOptional()
	@IsString()
	deliveryAddress?: string

	@ApiProperty({
		example: 'Ігор',
		description: "Ім'я замовника",
		required: false,
	})
	@IsOptional()
	@IsString()
	customerName?: string

	@ApiProperty({
		example: '+380991234567',
		description: 'Телефон замовника',
		required: false,
	})
	@IsOptional()
	@IsString()
	customerPhone?: string

	@ApiProperty({
		example: OrderStatus.COMPLETED,
		description: 'Статус замовлення',
		required: false,
		enum: OrderStatus,
	})
	@IsOptional()
	@IsEnum(OrderStatus)
	status?: OrderStatus
}
