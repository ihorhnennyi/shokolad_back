import { Body, Controller, Post } from '@nestjs/common'
import {
	ApiBadRequestResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'

@ApiTags('Авторизація')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('login')
	@ApiOperation({
		summary: 'Авторизація користувача',
		description: `Цей маршрут дозволяє увійти в систему, використовуючи електронну пошту та пароль.

Після успішної авторизації повертається JWT токен доступу, який необхідно використовувати для доступу до захищених ендпоінтів.

Приклад запиту:
POST /auth/login

Тіло запиту:
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
}

Після перевірки refresh токена система повертає нову пару токенів.`,
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
}
