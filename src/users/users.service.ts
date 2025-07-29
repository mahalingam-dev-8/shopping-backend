import { ConflictException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { createuserrequest } from './dto/create-user.resuest';
import { Prisma, User } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(private readonly prismaservice:PrismaService){} 

async createuser(data:createuserrequest):Promise<User>{


     try
    {
        const hashedPassword = await hash(data.password, 10);
        return this.prismaservice.user.create(
            {
               
            data:{...data, password: hashedPassword}
             
            }
    );
    }

    catch(err){
        if (
            err.code === 'P2002'
          ) {
            throw new ConflictException('Email already exists');
          }

          throw err;
    }
}


async getuser(filter: Prisma.UserWhereUniqueInput){

    return  this.prismaservice.user.findUniqueOrThrow(
       {
        where: filter,
       }
    );

}


}

