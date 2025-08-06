import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
	IsBoolean,
	IsMongoId,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator'

export class CreateProductDto {
	@ApiProperty({ example: 'Шоколад з логотипом' })
	@IsString()
	@IsNotEmpty()
	name: string

	@ApiPropertyOptional({ example: 'Смачний шоколад із брендуванням' })
	@IsOptional()
	@IsString()
	description?: string

	@ApiProperty({ example: 19.99 })
	@IsNumber()
	price: number

	@ApiPropertyOptional({ example: 'https://example.com/image.png' })
	@IsOptional()
	@IsString()
	image?: string

	@ApiProperty({ example: '64e1a9871e4a7e29df99aa1f' })
	@IsMongoId()
	category: string

	@ApiPropertyOptional({ example: true })
	@IsOptional()
	@IsBoolean()
	isActive?: boolean
}
