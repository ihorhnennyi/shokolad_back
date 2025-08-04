import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsEnum, MinLength } from 'class-validator'
import { UserRole } from '../../common/enums/role.enum'

export class CreateUserDto {
	@ApiProperty({ example: 'user@example.com' })
	@IsEmail()
	email: string

	@ApiProperty({ example: 'password123' })
	@MinLength(6)
	password: string

	@ApiProperty({ example: 'user', enum: UserRole })
	@IsEnum(UserRole)
	role: UserRole
}
