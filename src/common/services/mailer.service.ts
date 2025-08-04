import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailerService {
	private transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: process.env.SMTP_EMAIL,
			pass: process.env.SMTP_PASSWORD,
		},
	})

	async sendPasswordResetEmail(to: string, token: string) {
		const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

		await this.transporter.sendMail({
			from: `"Shokolad Support" <${process.env.SMTP_EMAIL}>`,
			to,
			subject: 'Скидання пароля',
			html: `
        <h2>Скидання пароля</h2>
        <p>Натисніть на посилання нижче, щоб скинути пароль:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Це посилання дійсне протягом 1 години.</p>
      `,
		})
	}
}
