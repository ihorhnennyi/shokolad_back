import { UnauthorizedException } from '@nestjs/common'

export class InvalidCredentialsException extends UnauthorizedException {
	constructor() {
		super('Невірна електронна пошта або пароль')
	}
}
