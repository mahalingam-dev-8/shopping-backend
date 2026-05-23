import { IsNumber, IsUrl } from "class-validator";

export class createproductnumber {

    @IsNumber()
    productnumber: number;

    @IsUrl({ require_tld: false })
    successUrl: string;

    @IsUrl({ require_tld: false })
    cancelUrl: string;

}