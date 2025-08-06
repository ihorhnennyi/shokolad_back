import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString } from 'class-validator'

export class SortQueryDto {
	@ApiPropertyOptional({
		example: 'price',
		description: 'Поле для сортування (name, price, createdAt...)',
	})
	@IsOptional()
	@IsString()
	sortBy?: string

	@ApiPropertyOptional({
		example: 'asc',
		description: 'Напрям сортування: asc або desc',
	})
	@IsOptional()
	@IsIn(['asc', 'desc'])
	order?: 'asc' | 'desc'
}
