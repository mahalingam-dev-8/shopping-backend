import { IsEmail, IsEnum, IsOptional, IsStrongPassword } from "class-validator";
import { Role } from "@prisma/client";

export class createuserrequest {

    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role = Role.USER;
}
