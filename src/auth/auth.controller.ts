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

Після успішної авторизації повертається JWT токен доступу, який необхідно використовувати для доступу до захищених ендпоінтів.

Приклад запиту:
POST /auth/login

{
  "email": "admin@example.com",
  "password": "admin123"
}

У разі помилки:
- 400 Bad Request — якщо відсутні або некоректні вхідні дані
- 401 Unauthorized — якщо користувач не знайдений або пароль невірний`,
	})
	@ApiResponse({
		status: 200,
		description: 'Повертає JWT токен доступу після успішної авторизації',
		schema: {
			example: {
				access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...',
				refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6...',
			},
		},
	})
	@ApiUnauthorizedResponse({
		description: 'Невірна електронна пошта або пароль',
	})
	@ApiBadRequestResponse({
		description: 'Некоректні вхідні дані (email або пароль)',
	})
	login(@Body() dto: LoginDto) {
		return this.authService.login(dto.email, dto.password)
	}

	@Post('refresh')
	@ApiOperation({
		summary: 'Оновлення токена доступу',
		description: `Цей маршрут дозволяє оновити access токен, використовуючи дійсний refresh токен.

Приклад запиту:
POST /auth/refresh

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}`,
	})
	@ApiResponse({
		status: 200,
		description: 'Нова пара токенів (access + refresh)',
		schema: {
			example: {
				access_token: 'new-access-token',
				refresh_token: 'new-refresh-token',
			},
		},
	})
	@ApiUnauthorizedResponse({
		description: 'Невірний або прострочений refresh токен',
	})
	@ApiBadRequestResponse({
		description: 'Відсутній або некоректний refresh токен',
	})
	refresh(@Body() dto: RefreshTokenDto) {
		return this.authService.refresh(dto.refresh_token)
	}

	@Get('me')
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Поточний авторизований користувач',
		description: `Повертає інформацію про користувача, що виконав вхід. 
Потрібно передати access_token у заголовку Authorization.`,
	})
	@ApiResponse({
		status: 200,
		description: 'Дані поточного користувача (id, email, роль)',
		type: MeResponseDto,
	})
	@ApiUnauthorizedResponse({ description: 'Неавторизований запит' })
	me(@CurrentUser() user: JwtPayload): MeResponseDto {
		return user
	}

	@Get('check')
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Перевірка токена доступу',
		description: `Цей маршрут використовується для перевірки дійсності JWT access токена. Потрібен авторизований запит.`,
	})
	@ApiResponse({ status: 200, description: 'Access токен дійсний' })
	@ApiUnauthorizedResponse({
		description: 'Неавторизований запит або прострочений токен',
	})
	check() {
		return { status: 'ok' }
	}

	@Post('logout')
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	@ApiOperation({
		summary: 'Вихід користувача',
		description: `Цей маршрут використовується для виходу користувача з системи. У продакшн-версії тут можна видаляти refresh токен із бази.`,
	})
	@ApiResponse({ status: 200, description: 'Успішний вихід користувача' })
	@ApiUnauthorizedResponse({ description: 'Неавторизований запит' })
	logout(@CurrentUser() user: JwtPayload) {
		return { message: `Користувач ${user.email} вийшов із системи` }
	}
}
