import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductRequest } from './dto/create-product.request';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ProductsGateway } from './products.gateway';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class ProductsService {

    constructor(
        private readonly prismaservice: PrismaService,
        private readonly ProductsGateway: ProductsGateway,
        private readonly s3Service: S3Service,
    ) {}

    async createproducts(datas: CreateProductRequest, userid: number) {
        const product = await this.prismaservice.product.create({
            data: { ...datas, userid },
        });
        this.ProductsGateway.handleproductupdated();
        return product;
    }

    async products(status?: string) {
        const args: Prisma.ProductFindManyArgs = {};
        if (status === 'available') {
            args.where = { sold: false };
        }
        const products = await this.prismaservice.product.findMany(args);
        return Promise.all(
            products.map(async (product) => ({
                ...product,
                imageUrl: await this.s3Service.getImageUrl(`${product.id}.jpg`),
            })),
        );
    }

    async getproduct(productId: number) {
        try {
            return {
                ...(await this.prismaservice.product.findUniqueOrThrow({ where: { id: productId } })),
                imageUrl: await this.s3Service.getImageUrl(`${productId}.jpg`),
            };
        } catch (err) {
            throw new NotFoundException(`Product not found for id ${productId}`);
        }
    }

    async update(productId: number, data: Prisma.ProductUpdateInput) {
        await this.prismaservice.product.update({ where: { id: productId }, data });
        this.ProductsGateway.handleproductupdated();
    }
}
