import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator'
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto'

export class FilterProductDto extends PaginationQueryDto {
	@ApiPropertyOptional({
		example: '64f50fdce2...',
		description: 'ID категорії',
	})
	@IsOptional()
	@IsMongoId()
	category?: string

	@ApiPropertyOptional({ example: 'true', description: 'Активні продукти' })
	@IsOptional()
	@IsBoolean()
	isActive?: boolean

	@ApiPropertyOptional({ example: 'шоколад', description: 'Пошук за назвою' })
	@IsOptional()
	@IsString()
	search?: string

	@ApiPropertyOptional({
		example: 'createdAt',
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
	@IsString()
	order?: 'asc' | 'desc'
}
