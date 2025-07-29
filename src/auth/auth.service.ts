import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

import * as ms from 'ms';
import { User } from 'generated/prisma';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './token-payload.interface';
import { Response } from 'express';

@Injectable()
export class AuthService {

    constructor(
        private readonly userservice: UsersService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
      ) {}

     async verifyuser(email:string , password:string){
         
         try{

            const user = await this.userservice.getuser({email});
            const authenticate = await compare(password, user.password);
            if(!authenticate)
            {
                throw new UnauthorizedException();
            }
            return user;
        }
         catch(err){

            throw new UnauthorizedException('credentails not found');
         }
         
     }


     async login(user: User, response: Response) {
        const jwtExpiration = this.configService.get<string>('JWT_EXPIRATION') || '1h';
        const expirationMs = ms(jwtExpiration as unknown as ms.StringValue);
        const expires = new Date();
        expires.setMilliseconds(
          expires.getMilliseconds() +
          expirationMs,
        );
        
        const tokenpayload : TokenPayload = {
            userid: user.id,
        };

        const token = this.jwtService.sign(tokenpayload);
        
        response.cookie('Authentication',token,{
            secure:true,
            httpOnly:true,
            expires,
        });

        return {tokenpayload} ;
    }

       verifyToken(jwt: string) {
    this.jwtService.verify(jwt);
  }

}
