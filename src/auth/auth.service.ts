import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'

import { InvalidCredentialsException } from 'src/common/exceptions/auth-exceptions'
import { UserDocument } from '../users/schemas/user.schema'
import { UserService } from '../users/user.service'
import { JwtPayload } from './jwt.strategy'

@Injectable()
export class AuthService {
	private readonly jwtSecret: string
	private readonly accessTokenTTL: string
	private readonly refreshTokenTTL: string

	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {
		this.jwtSecret =
			this.configService.get<string>('JWT_SECRET') || 'default_secret'
		this.accessTokenTTL =
			this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m'
		this.refreshTokenTTL =
			this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d'
	}

	async validateUser(email: string, password: string): Promise<UserDocument> {
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
			const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
				secret: this.jwtSecret,
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

	async getMe(payload: JwtPayload) {
		const user = await this.userService.findByEmail(payload.email)
		if (!user) {
			throw new UnauthorizedException('Користувача не знайдено')
		}

		return {
			_id: user._id,
			email: user.email,
			role: user.role,
		}
	}

	async generateTokens(user: UserDocument) {
		const payload: JwtPayload = {
			sub: user._id.toString(),
			email: user.email,
			role: user.role,
		}

		const access_token = this.jwtService.sign(payload, {
			secret: this.configService.get('JWT_SECRET'),
			expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
		})

		const refresh_token = this.jwtService.sign(payload, {
			secret: this.configService.get('JWT_SECRET'),
			expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
		})

		return { access_token, refresh_token }
	}
}
