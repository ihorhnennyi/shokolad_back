import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
		})
	)

	const config = new DocumentBuilder()
		.setTitle('Shokolad API')
		.setDescription(
			`Цей розділ містить всі ендпоінти, що пов’язані з авторизацією та аутентифікацією користувачів.

Ви можете увійти в систему, використовуючи логін та пароль.

Після успішної авторизації ви отримаєте JWT токен доступу, який необхідно вставити у поле "Authorize" у верхньому правому куті, щоб мати доступ до захищених маршрутів.

Усі запити до захищених маршрутів повинні містити заголовок:
Authorization: Bearer <ваш токен>

У разі помилки логіну — отримаєте відповідь 401 (Unauthorized).

Для тестування ви можете використати обліковий запис:
- email: admin@example.com
- пароль: admin123`
		)
		.setVersion('1.0')
		.addBearerAuth()
		.build()

	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api/docs', app, document)

	const port = process.env.PORT || 3000
	await app.listen(port)

	console.log(`🚀 Server is running on http://localhost:${port}`)
	console.log(`📚 Swagger is available at http://localhost:${port}/api/docs`)
}

bootstrap()
