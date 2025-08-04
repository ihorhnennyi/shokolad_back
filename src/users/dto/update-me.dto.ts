import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString } from 'class-validator'

export class UpdateMeDto {
	@ApiPropertyOptional({ example: 'me@example.com' })
	@IsOptional()
	@IsEmail()
	email?: string

	@ApiPropertyOptional({ example: 'newpassword123' })
	@IsOptional()
	@IsString()
	password?: string
}
