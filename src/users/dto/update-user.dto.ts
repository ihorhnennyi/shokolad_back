import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString } from 'class-validator'
import { UserRole } from 'src/common/enums/role.enum'

export class UpdateUserDto {
	@ApiPropertyOptional({ example: 'newemail@example.com' })
	@IsOptional()
	@IsEmail()
	email?: string

	@ApiPropertyOptional({ example: 'newpassword123' })
	@IsOptional()
	@IsString()
	password?: string

	@ApiPropertyOptional({ enum: UserRole, example: UserRole.MANAGER })
	@IsOptional()
	role?: UserRole
}
