import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsMongoId,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator'

class UpdateOrderItemDto {
	@ApiProperty({ example: '64fabc123...', description: 'ID продукта' })
	@IsOptional()
	@IsMongoId()
	productId?: string

	@ApiProperty({ example: 2, description: 'Кількість' })
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
	})
	@IsOptional()
	@IsString()
	deliveryAddress?: string

	@ApiProperty({ example: 'Ігор', description: 'Імʼя замовника' })
	@IsOptional()
	@IsString()
	customerName?: string

	@ApiProperty({ example: '+380991234567', description: 'Телефон замовника' })
	@IsOptional()
	@IsString()
	customerPhone?: string

	@ApiProperty({ example: 'доставлено', description: 'Статус замовлення' })
	@IsOptional()
	@IsString()
	status?: string

	@ApiProperty({ example: '64fa123...', description: 'ID користувача' })
	@IsOptional()
	@IsMongoId()
	userId?: string
}
