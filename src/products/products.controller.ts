import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProductRequest } from './dto/create-product.request';
import { currentuser } from 'src/auth/current-user.decorator';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PRODUCT_IMAGES } from './product-images';


@Controller('products')
export class ProductsController {

    constructor(private readonly ProductsService:ProductsService){}

    @Post()
    @UseGuards(JwtAuthGuard)
    createproducts(@Body() body:CreateProductRequest, @currentuser() user: TokenPayload){
                
         return  this.ProductsService.createproducts(body,user.userid)

    }


    @Post(':productId/image')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('image',{
        storage : diskStorage({
             destination : PRODUCT_IMAGES,
             filename : (req,file,callback) => {
                callback(null, `${req.params.productId}${extname(file.originalname)}`);
             },
        }),
    }),
)
    uploadproductimage(
        @UploadedFile(
            new ParseFilePipe({
                validators : [new MaxFileSizeValidator({maxSize:500000}), new FileTypeValidator({fileType: 'image/jpeg'})]
            })
        )
        _File:Express.Multer.File){
            
    }
 


    @Get()
    @UseGuards(JwtAuthGuard)
    getproducts(@Query('status')  status?:string){
        return this.ProductsService.products(status)
    }

    @Get(':productId')
    @UseGuards(JwtAuthGuard)
    getproduct(@Param('productId') productId:string)
    {
            return this.ProductsService.getproduct(+productId);
    }


}
