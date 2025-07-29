import { IsNumber } from "class-validator";

export class createproductnumber{

    @IsNumber()
    productnumber:number;

}