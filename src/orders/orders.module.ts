import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Product, ProductSchema } from '../products/schemas/product.schema' // <---
import { OrderController } from './orders.controller'
import { OrderService } from './orders.service'
import { Order, OrderSchema } from './schemas/order.schema'

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Order.name, schema: OrderSchema },
			{ name: Product.name, schema: ProductSchema }, // <--- добавить!
		]),
	],
	controllers: [OrderController],
	providers: [OrderService],
})
export class OrdersModule {}
