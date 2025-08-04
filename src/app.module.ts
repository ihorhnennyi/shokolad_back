import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './auth/auth.module'
import { CategoriesModule } from './categories/categories.module'
import { OptionsModule } from './options/options.module'
import { OrdersModule } from './orders/orders.module'
import { ProductsModule } from './products/products.module'
import { UserModule } from './users/user.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		MongooseModule.forRoot(process.env.MONGODB_URI || ''),
		AuthModule,
		UserModule,
		ProductsModule,
		CategoriesModule,
		OptionsModule,
		OrdersModule,
	],
})
export class AppModule {}
