import { IsEmail, IsStrongPassword } from "class-validator";



export class createuserrequest{
    
    @IsEmail()
    email:string;
    
    @IsStrongPassword()
    password:string;
}
