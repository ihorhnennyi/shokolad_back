import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { UserRole } from '../common/enums/role.enum'
import { RolesGuard } from '../common/guards/roles.guard'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@ApiTags('Категорії')
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
	constructor(private readonly service: CategoriesService) {}

	@Post()
	@Roles(UserRole.ADMIN)
	create(@Body() dto: CreateCategoryDto) {
		return this.service.create(dto)
	}

	@Get()
	findAll() {
		return this.service.findAll()
	}

	@Get(':id')
	findById(@Param('id') id: string) {
		return this.service.findById(id)
	}

	@Patch(':id')
	@Roles(UserRole.ADMIN)
	update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
		return this.service.update(id, dto)
	}

	@Delete(':id')
	@Roles(UserRole.ADMIN)
	remove(@Param('id') id: string) {
		return this.service.remove(id)
	}
}
