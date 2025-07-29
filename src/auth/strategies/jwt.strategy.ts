import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";

import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(private readonly configservice: ConfigService) {
        super({
          jwtFromRequest: ExtractJwt.fromExtractors([
            (request: Request) => request.cookies.Authentication ,
          ]),
          secretOrKey: configservice.get('JWT_SECRET'),
        });
      }
    
      async validate(payload: any) {
        return payload; 
      }
}