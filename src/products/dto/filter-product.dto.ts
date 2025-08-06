import { ApiPropertyOptional } from '@nestjs/swagger'
import {
	IsBoolean,
	IsMongoId,
	IsNumberString,
	IsOptional,
	IsString,
} from 'class-validator'

export class FilterProductDto {
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

	@ApiPropertyOptional({ example: '10', description: 'Кількість на сторінку' })
	@IsOptional()
	@IsNumberString()
	limit?: string

	@ApiPropertyOptional({ example: '1', description: 'Номер сторінки' })
	@IsOptional()
	@IsNumberString()
	page?: string
}
