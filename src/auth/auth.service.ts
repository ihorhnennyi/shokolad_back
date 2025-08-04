import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'

import { InvalidCredentialsException } from 'src/common/exceptions/auth-exceptions'
import { UserService } from '../users/user.service'

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService
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
		const payload = { sub: user._id, email: user.email, role: user.role }

		return {
			access_token: this.jwtService.sign(payload),
		}
	}
}
