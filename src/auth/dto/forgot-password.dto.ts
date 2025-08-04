import { ApiProperty } from '@nestjs/swagger'
import { IsEmail } from 'class-validator'

export class ForgotPasswordDto {
	@ApiProperty({
		example: 'user@example.com',
		description:
			'Електронна пошта користувача, на яку буде надіслано лист для відновлення пароля.',
	})
	@IsEmail({}, { message: 'Невірний формат email адреси' })
	email: string
}
