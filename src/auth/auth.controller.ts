import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';
import { currentuser } from './current-user.decorator';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { Response } from 'express';

@ApiTags('Auth')
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
