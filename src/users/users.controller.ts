import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { createuserrequest } from './dto/create-user.resuest';
import { UsersService } from './users.service';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { currentuser } from 'src/auth/current-user.decorator';
import { TokenPayload } from 'src/auth/token-payload.interface';

@Controller('users')
export class UsersController {

       constructor(private readonly userservice : UsersService ){

       }

    @Post()
    @UseInterceptors(NoFilesInterceptor)
    createuser(@Body() request:createuserrequest){
        return this.userservice.createuser(request); 
    }


    @Get('me')
    @UseGuards(JwtAuthGuard)
    getme(@currentuser() user:TokenPayload){
         return user;
    }
     

}
