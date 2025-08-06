import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumberString, IsOptional } from 'class-validator'

export class PaginationQueryDto {
	@ApiPropertyOptional({ example: '10', description: 'Кількість на сторінку' })
	@IsOptional()
	@IsNumberString()
	limit?: string

	@ApiPropertyOptional({ example: '1', description: 'Номер сторінки' })
	@IsOptional()
	@IsNumberString()
	page?: string
}
