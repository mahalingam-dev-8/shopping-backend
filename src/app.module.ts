import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { dirname, join } from 'path';
import { CheckoutModule } from './checkout/checkout.module';


@Module({
  imports: [UsersModule,ConfigModule.forRoot(), AuthModule, ProductsModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..','public')
  }), CheckoutModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
