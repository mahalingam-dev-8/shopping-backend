import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { currentuser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getMyOrders(@currentuser() user: TokenPayload) {
    return this.ordersService.getUserOrders(user.userid);
  }

  @Get('all')
  @Roles(Role.ADMIN)
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }
}
