import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module'
import { CategoriesModule } from './categories/categories.module'
import { OptionsModule } from './options/options.module'
import { OrdersModule } from './orders/orders.module'
import { ProductModule } from './products/product.module'
import { UserModule } from './users/user.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		MongooseModule.forRoot(process.env.MONGODB_URI || ''),
		AuthModule,
		UserModule,
		ProductModule,
		CategoriesModule,
		OptionsModule,
		OrdersModule,
	],
})
export class AppModule {}
