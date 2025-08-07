import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { OrderStatus } from '../schemas/order.schema'

export class UpdateOrderStatusDto {
	@ApiProperty({
		example: OrderStatus.COMPLETED,
		enum: OrderStatus,
		description: 'Новий статус замовлення',
	})
	@IsEnum(OrderStatus)
	status: OrderStatus

	@ApiPropertyOptional({
		example: 'Оплата підтверджена, відправляємо замовлення.',
		description: 'Коментар до зміни статусу',
	})
	@IsOptional()
	@IsString()
	comment?: string
}
