import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'

import { InvalidCredentialsException } from 'src/common/exceptions/auth-exceptions'
import { UserDocument } from '../users/schemas/user.schema'
import { UserService } from '../users/user.service'

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {}

	async validateUser(email: string, password: string) {
		const user = await this.userService.findByEmail(email)
		if (!user || !(await bcrypt.compare(password, user.password))) {
			throw new InvalidCredentialsException()
		}
		return user
	}

	async login(email: string, password: string) {
		const user = await this.validateUser(email, password)
		return this.generateTokens(user)
	}

	async refresh(refreshToken: string) {
		try {
			const payload = this.jwtService.verify(refreshToken, {
				secret: this.configService.get('JWT_SECRET'),
			})

			const user = await this.userService.findByEmail(payload.email)
			if (!user) {
				throw new UnauthorizedException('Користувача не знайдено')
			}

			return this.generateTokens(user)
		} catch {
			throw new UnauthorizedException('Невірний або прострочений refresh токен')
		}
	}

	async generateTokens(user: UserDocument) {
		const payload = {
			sub: user._id,
			email: user.email,
			role: user.role,
		}

		const access_token = this.jwtService.sign(payload, {
			expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN') || '15m',
		})

		const refresh_token = this.jwtService.sign(payload, {
			expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
		})

		return {
			access_token,
			refresh_token,
		}
	}
}
