import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import Stripe from 'stripe';

@Injectable()
export class CheckoutService {

    constructor(private readonly ProductsService: ProductsService, private readonly Stripe: Stripe){

    }


    async createsession(productId: number, successUrl: string, cancelUrl: string){
       const product = await this.ProductsService.getproduct(productId);
          return  await this.Stripe.checkout.sessions.create(
            {
                metadata:{
                    productId,
                },
                line_items: [
                    {
                        price_data:{
                            currency: 'usd',
                            unit_amount: product.price*100,
                            product_data: {
                                name: product.name,
                                description: product.description
                            }
                        },
                        quantity: 1,
                    }
                ],
                mode:'payment',
                success_url: successUrl,
                cancel_url: cancelUrl,
            }
          )
    }

   async handleCheckoutWebhook(event: any) {
    if (event.type !== 'checkout.session.completed') {
      return;
    }

    const session = await this.Stripe.checkout.sessions.retrieve(
      event.data.object.id,
    );
    await this.ProductsService.update(parseInt(session.metadata.productId), {
      sold: true,
    });
  }

}
