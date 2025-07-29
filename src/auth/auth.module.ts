import { Inject, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports : [JwtModule.registerAsync({
    imports : [ConfigModule] ,
    useFactory : (ConfigService : ConfigService ) => ({
      secret : ConfigService.getOrThrow('JWT_SECRET'),
      signOptions:{
        expiresIn: ConfigService.getOrThrow('JWT_EXPIRATION'),
      },
    }),
    inject : [ConfigService]
  }), ConfigModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy,JwtStrategy],
  exports:[AuthService]
})
export class AuthModule {}
