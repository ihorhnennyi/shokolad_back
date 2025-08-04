import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { AuthService } from './auth.service'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { LoginDto } from './dto/login.dto'
import { MeResponseDto } from './dto/me-response.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { JwtPayload } from './jwt.strategy'

@ApiTags('Авторизація')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	@ApiOperation({
		summary: 'Авторизація користувача',
		description: `Цей маршрут дозволяє увійти в систему, використовуючи електронну пошту та пароль.

Після успішної авторизації повертається JWT access і refresh токени.

Приклад запиту:
POST /auth/login

{
  "email": "admin@example.com",
  "password": "admin123"
}`,
	})
	@ApiResponse({
		status: 200,
		description: 'JWT токени після успішної авторизації',
		schema: {
			example: {
				access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...',
				refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...',
			},
		},
	})
	@ApiBadRequestResponse({
		description: 'Некоректні вхідні дані (email або пароль)',
	})
	@ApiUnauthorizedResponse({
		description: 'Невірна електронна пошта або пароль',
	})
	login(@Body() dto: LoginDto) {
		return this.authService.login(dto.email, dto.password)
	}

	@Post('refresh')
	@ApiOperation({
		summary: 'Оновлення access токена',
		description: `Оновлює JWT access і refresh токени за наявності валідного refresh токена.

Приклад запиту:
POST /auth/refresh

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}`,
	})
	@ApiResponse({
		status: 200,
		description: 'Оновлені JWT токени',
		schema: {
			example: {
				access_token: 'new-access-token',
				refresh_token: 'new-refresh-token',
			},
		},
	})
	@ApiBadRequestResponse({
		description: 'Відсутній або некоректний refresh токен',
	})
	@ApiUnauthorizedResponse({
		description: 'Невірний або прострочений refresh токен',
	})
	refresh(@Body() dto: RefreshTokenDto) {
		return this.authService.refresh(dto.refresh_token)
	}

	@Get('me')
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Отримати поточного користувача',
		description: `Повертає дані про авторизованого користувача. Потрібно передати JWT access токен.`,
	})
	@ApiResponse({
		status: 200,
		description: 'Інформація про користувача',
		type: MeResponseDto,
	})
	@ApiUnauthorizedResponse({
		description: 'Користувач не авторизований або токен недійсний',
	})
	me(@CurrentUser() user: JwtPayload): MeResponseDto {
		return {
			userId: user.sub,
			email: user.email,
			role: user.role,
		}
	}

	@Get('check')
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Перевірка валідності access токена',
		description: 'Простий запит для перевірки, чи дійсний access токен.',
	})
	@ApiResponse({
		status: 200,
		description: 'Access токен дійсний',
		schema: {
			example: {
				status: 'ok',
			},
		},
	})
	@ApiUnauthorizedResponse({
		description: 'Невірний або прострочений токен',
	})
	check() {
		return { status: 'ok' }
	}

	@Post('logout')
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Вихід користувача',
		description: `Вихід користувача з системи. У майбутньому тут може бути реалізоване видалення refresh токена.`,
	})
	@ApiResponse({
		status: 200,
		description: 'Користувач успішно вийшов',
		schema: {
			example: {
				message: 'Користувач admin@example.com вийшов із системи',
			},
		},
	})
	@ApiUnauthorizedResponse({
		description: 'Користувач не авторизований',
	})
	logout(@CurrentUser() user: JwtPayload) {
		return {
			message: `Користувач ${user.email} вийшов із системи`,
		}
	}

	@Post('forgot-password')
	@ApiOperation({
		summary: 'Забули пароль — надсилання листа',
		description: `Цей маршрут надсилає листа з посиланням на скидання пароля на вказану пошту.`,
	})
	@ApiResponse({
		status: 200,
		description: 'Лист успішно надіслано',
		schema: {
			example: {
				message: 'Інструкції для скидання пароля надіслані на пошту',
			},
		},
	})
	@ApiBadRequestResponse({ description: 'Некоректна email адреса' })
	forgotPassword(@Body() dto: ForgotPasswordDto) {
		return this.authService.forgotPassword(dto.email)
	}
}
