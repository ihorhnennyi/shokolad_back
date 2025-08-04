import * as bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
import * as mongoose from 'mongoose'
import { UserSchema } from '../users/schemas/user.schema'

dotenv.config()

async function run() {
	await mongoose.connect(process.env.MONGODB_URI || '')
	const UserModel = mongoose.model('User', UserSchema)

	const exists = await UserModel.findOne({ email: 'admin@example.com' })
	if (!exists) {
		await UserModel.create({
			name: 'Admin',
			email: 'admin@example.com',
			password: await bcrypt.hash('admin123', 10),
			role: 'admin',
		})
		console.log('✅ Admin created')
	} else {
		console.log('ℹ️ Admin already exists')
	}

	await mongoose.disconnect()
}

run()
