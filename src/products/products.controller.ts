import { Body, Controller, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProductRequest } from './dto/create-product.request';
import { currentuser } from 'src/auth/current-user.decorator';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Products')
@Controller('products')
export class ProductsController {

    constructor(
        private readonly ProductsService: ProductsService,
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
                    new MaxFileSizeValidator({ maxSize: 2000000 }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        const imageUrl = await this.ProductsService.uploadImage(+productId, file);
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
