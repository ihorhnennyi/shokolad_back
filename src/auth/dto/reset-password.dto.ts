import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'

export class ResetPasswordDto {
	@ApiProperty({
		example: 'newStrongPassword123',
		description: 'Новий пароль користувача (мінімум 6 символів)',
	})
	@IsString()
	@MinLength(6, { message: 'Пароль має містити щонайменше 6 символів' })
	newPassword: string

	@ApiProperty({
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
		description:
			'Токен відновлення паролю, отриманий на email зі шляху /auth/forgot-password',
	})
	@IsString()
	token: string
}
