import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductsService } from 'src/products/products.service';
import Stripe from 'stripe';

@Injectable()
export class CheckoutService {

    constructor(private readonly ProductsService:ProductsService , private readonly Stripe:Stripe, private readonly ConfigServie:ConfigService){

    }


    async createsession(productId: number){
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
                success_url: this.ConfigServie.getOrThrow('STRIPE_SUCEESS_URL'),
                cancel_url: this.ConfigServie.getOrThrow('STRIPE_CANCEL_URL')
                
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
