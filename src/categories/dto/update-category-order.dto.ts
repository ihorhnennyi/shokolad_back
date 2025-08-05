import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'

export class UpdateCategoryOrderDto {
	@ApiProperty({ example: 3, description: 'Новий порядок категорії' })
	@IsNumber()
	order: number
}
