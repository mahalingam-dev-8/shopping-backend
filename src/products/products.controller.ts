import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProductRequest } from './dto/create-product.request';
import { currentuser } from 'src/auth/current-user.decorator';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/s3/s3.service';

@Controller('products')
export class ProductsController {

    constructor(
        private readonly ProductsService: ProductsService,
        private readonly s3Service: S3Service,
    ) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    createproducts(@Body() body: CreateProductRequest, @currentuser() user: TokenPayload) {
        return this.ProductsService.createproducts(body, user.userid);
    }

    @Post(':productId/image')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    async uploadproductimage(
        @Param('productId') productId: string,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 500000 }),
                    new FileTypeValidator({ fileType: 'image/jpeg' }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        const imageUrl = await this.s3Service.uploadImage(`${productId}.jpg`, file.buffer, file.mimetype);
        return { imageUrl };
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    getproducts(@Query('status') status?: string) {
        return this.ProductsService.products(status);
    }

    @Get(':productId')
    @UseGuards(JwtAuthGuard)
    getproduct(@Param('productId') productId: string) {
        return this.ProductsService.getproduct(+productId);
    }
}
