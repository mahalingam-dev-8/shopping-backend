import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { OrdersService } from 'src/orders/orders.service';
import Stripe from 'stripe';

@Injectable()
export class CheckoutService {

  constructor(
    private readonly ProductsService: ProductsService,
    private readonly ordersService: OrdersService,
    private readonly Stripe: Stripe,
  ) {}

  async createsession(productId: number, userId: number, successUrl: string, cancelUrl: string) {
    const product = await this.ProductsService.getproduct(productId);
    return this.Stripe.checkout.sessions.create({
      metadata: { productId, userId },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: product.price * 100,
            product_data: {
              name: product.name,
              description: product.description,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  }

  async handleCheckoutWebhook(event: any) {
    if (event.type !== 'checkout.session.completed') return;

    const session = await this.Stripe.checkout.sessions.retrieve(event.data.object.id);
    const productId = parseInt(session.metadata.productId);
    const userId = parseInt(session.metadata.userId);

    await this.ProductsService.update(productId, { sold: true });
    await this.ordersService.createOrder(userId, productId);
  }
}
