import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { OrderStatus } from '../schemas/order.schema'

export class UpdateOrderStatusDto {
	@ApiProperty({
		example: OrderStatus.COMPLETED,
		enum: OrderStatus,
		description: 'Новий статус замовлення',
	})
	@IsEnum(OrderStatus)
	status: OrderStatus
}
