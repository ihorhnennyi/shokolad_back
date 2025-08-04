import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class UpdateUserStatusDto {
	@ApiProperty({ example: true, description: 'Активний стан користувача' })
	@IsBoolean()
	isActive: boolean
}
