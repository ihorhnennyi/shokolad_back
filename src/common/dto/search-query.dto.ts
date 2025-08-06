import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class SearchQueryDto {
	@ApiPropertyOptional({ example: 'шоколад', description: 'Пошук за назвою' })
	@IsOptional()
	@IsString()
	search?: string
}
