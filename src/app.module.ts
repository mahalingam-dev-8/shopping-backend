import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CheckoutModule } from './checkout/checkout.module';
import { OrdersModule } from './orders/orders.module';
import { HealthController } from './health.controller';


@Module({
  imports: [UsersModule, ConfigModule.forRoot(), AuthModule, ProductsModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..','public')
  }), CheckoutModule, OrdersModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
