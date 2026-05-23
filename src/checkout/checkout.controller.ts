import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { currentuser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { createproductnumber } from './dto/create-session';
import { CheckoutService } from './checkout.service';

@ApiTags('Checkout')
@Controller('checkout')
export class CheckoutController {

  constructor(private readonly CheckoutService: CheckoutService) {}

  @Post('session')
  @UseGuards(JwtAuthGuard)
  async createSession(@Body() productrequest: createproductnumber, @currentuser() user: TokenPayload) {
    return this.CheckoutService.createsession(productrequest.productnumber, user.userid, productrequest.successUrl, productrequest.cancelUrl);
  }

  @Post('webhook')
  async handleCheckoutWebhooks(@Body() event: any) {
    return this.CheckoutService.handleCheckoutWebhook(event);
  }
}
