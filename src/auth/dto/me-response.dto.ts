import { ApiProperty } from '@nestjs/swagger'

export class MeResponseDto {
	@ApiProperty({
		example: '64a1f9f4e72b6a0012d13c9a',
		description: 'Унікальний ідентифікатор користувача',
	})
	sub: string

	@ApiProperty({
		example: 'admin@example.com',
		description: 'Електронна пошта користувача',
	})
	email: string

	@ApiProperty({
		example: 'admin',
		description: 'Роль користувача (наприклад, admin, user тощо)',
	})
	role: string
}
