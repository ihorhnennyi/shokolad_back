import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class RefreshTokenDto {
	@ApiProperty({
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
		description:
			'Refresh токен, отриманий під час авторизації. Використовується для отримання нового access токена.',
	})
	@IsString({ message: 'Refresh токен повинен бути рядком' })
	refresh_token: string
}
