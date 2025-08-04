import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from 'src/common/enums/role.enum'

export class UserDto {
	@ApiProperty({ example: '64d6f8a9e674e123456789ab' })
	id: string

	@ApiProperty({ example: 'user@example.com' })
	email: string

	@ApiProperty({ example: 'admin', enum: UserRole })
	role: UserRole
}
