import {promises as fs } from 'fs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductRequest } from './dto/create-product.request';
import { PrismaService } from 'src/prisma/prisma.service';
import { join } from 'path';
import { PRODUCT_IMAGES } from './product-images';
import { Prisma } from '@prisma/client';
import { ProductsGateway } from './products.gateway';







@Injectable()
export class ProductsService {

    constructor(private readonly prismaservice:PrismaService, private readonly ProductsGateway: ProductsGateway){} 
    

    async createproducts(datas:CreateProductRequest, userid:number){

        const product =  this.prismaservice.product.create(
            {
                data:{
                    ...datas, userid,
                }
            }
        )
        this.ProductsGateway.handleproductupdated();
        return product
        

    }

   

    async products(status?:string){
        const args : Prisma.ProductFindManyArgs = {};
        if(status == 'available')
        {
             args.where = {sold: false};
             
        }
        const products = await this.prismaservice.product.findMany();
        return Promise.all(
            products.map(async(product)=> ({
                ...product,
                imageexists: await this.imageexists(product.id),
            }))
        )
    }

   private async imageexists(productid:number){
    try{
        await fs.access(
               join(`${PRODUCT_IMAGES}/${productid}.jpg`),
               fs.constants.F_OK,
        );
        return true;
    }
    catch(err){
        return false;
    }
   }

   async getproduct(productId:number){
    try{ return {
        ...(await this.prismaservice.product.findUniqueOrThrow({where : {id : productId}})), 
    imageexists: await this.imageexists(productId)}; 
   }
   catch(err)
   {
    throw new NotFoundException(`the product is not found for the given ${productId}` );            
   }
}
   
async update(productId: number, data: Prisma.ProductUpdateInput) {
    await this.prismaservice.product.update({
      where: { id: productId },
      data,
    });
    this.ProductsGateway.handleproductupdated();
  }
    

}
