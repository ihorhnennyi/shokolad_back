import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsMongoId, IsOptional, IsString } from 'class-validator'

export class CreateCategoryDto {
	@ApiProperty({ example: 'Новини' })
	@IsString()
	name: string

	@ApiPropertyOptional({ example: 'Опис категорії' })
	@IsOptional()
	@IsString()
	description?: string

	@ApiPropertyOptional({ example: '64e1a9871e4a7e29df99aa1f' })
	@IsOptional()
	@IsMongoId()
	parent?: string
}
