import { ApiProperty } from '@nestjs/swagger'

export class MeResponseDto {
	@ApiProperty({
		example: '64fae5a6c62f5a85a9d3a51c',
		description: 'Унікальний ідентифікатор користувача',
	})
	userId: string

	@ApiProperty({
		example: 'admin@example.com',
		description: 'Електронна пошта користувача',
	})
	email: string

	@ApiProperty({
		example: 'admin',
		description: 'Роль користувача (admin або user)',
	})
	role: string
}
