import { ApiProperty } from '@nestjs/swagger'

export class PaginatedResponseDto<T> {
	@ApiProperty({ description: 'Масив елементів' })
	items: T[]

	@ApiProperty({ example: 42, description: 'Загальна кількість елементів' })
	totalCount: number

	@ApiProperty({ example: 5, description: 'Загальна кількість сторінок' })
	totalPages: number

	@ApiProperty({ example: 1, description: 'Поточна сторінка' })
	currentPage: number
}
