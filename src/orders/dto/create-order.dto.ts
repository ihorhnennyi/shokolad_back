import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator'

export class OrderItemDto {
	@ApiProperty({ example: '64fabc123...', description: 'ID продукта' })
	@IsMongoId()
	productId: string

	@ApiProperty({ example: 2, description: 'Кількість' })
	@IsNumber()
	quantity: number
}

export class CreateOrderDto {
	@ApiProperty({
		example: '64fa123...',
		description: 'ID користувача (опціонально)',
	})
	@IsOptional()
	@IsMongoId()
	userId?: string

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

	@ApiProperty({ example: 'Ігор', description: 'Імʼя замовника' })
	@IsString()
	@IsNotEmpty()
	customerName: string

	@ApiProperty({ example: '+380991234567', description: 'Телефон замовника' })
	@IsString()
	@IsNotEmpty()
	customerPhone: string
}
