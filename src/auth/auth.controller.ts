import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { currentuser } from './current-user.decorator';
import { User } from 'generated/prisma';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {

    constructor(private readonly authserivce:AuthService){

    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@currentuser() user:User, @Res({ passthrough: true }) response:Response){
                         
        return this.authserivce.login(user,response)
                           
    }

}
