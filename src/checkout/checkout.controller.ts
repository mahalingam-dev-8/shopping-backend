import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { createproductnumber } from './dto/create-session';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
export class CheckoutController {

    constructor(private readonly CheckoutService:CheckoutService){

    }

@Post('session')
@UseGuards(JwtAuthGuard)
async createSession(@Body() productrequest:createproductnumber){

    return this.CheckoutService.createsession(productrequest.productnumber);

}

  @Post('webhook')
  async handleCheckoutWebhooks(@Body() event: any) {
    return this.CheckoutService.handleCheckoutWebhook(event);
  }

}
