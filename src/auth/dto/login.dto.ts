import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class LoginDto {
	@ApiProperty({
		example: 'admin@example.com',
		description: 'Електронна пошта користувача. Обовʼязкове поле.',
	})
	@IsEmail({}, { message: 'Невірний формат email адреси' })
	email: string

	@ApiProperty({
		example: 'admin123',
		description: 'Пароль користувача. Мінімум 6 символів.',
	})
	@IsString({ message: 'Пароль повинен бути рядком' })
	password: string
}
