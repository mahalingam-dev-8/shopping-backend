import { IsNumber, IsUrl } from "class-validator";

export class createproductnumber {

    @IsNumber()
    productnumber: number;

    @IsUrl()
    successUrl: string;

    @IsUrl()
    cancelUrl: string;

}