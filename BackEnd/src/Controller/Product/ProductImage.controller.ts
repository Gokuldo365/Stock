import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CurrentUser } from '@Helper/Common.helper';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { ProductImageService } from '@Root/Service/Product/ProductImage.service';
import { ProductImageModel, ProductImageUpdateModel } from '@Model/Product/ProductImage.model';
import * as fs from 'fs';
import { CommonService } from '@Root/Service/Common.service';
import path from 'path';


@Controller({ path: "ProductImage", version: '1' })
@ApiTags("ProductImage")
export class ProductImageController extends JWTAuthController {

    constructor(private _ProductImageService: ProductImageService, private _CommonService: CommonService) {
        super()
    }

    //     @Post('UploadFiles/:product_id')
    //     @UseInterceptors(FilesInterceptor('files', 5, {
    //     storage: diskStorage({
    //         destination: './uploads',
    //         filename: (_req, file, cb) => {
    //             cb(null, file.originalname);
    //         },
    //     }),
    //     }))
    //     @ApiConsumes('multipart/form-data')
    //     @ApiBody({
    //     schema: {
    //         type: 'object',
    //         properties: {
    //             files: { type: 'array', items: { type: 'string', format: 'binary', description: 'The files to upload' } },
    //         },
    //     },
    //     })
    //     async UploadFiles(
    //     @Param('product_id') productId: string,
    //     @CurrentUser() UserId: string,
    //     @UploadedFiles() files: Express.Multer.File[],
    //     @Body() ProductImageData: ProductImageModel
    //     ) {
    //     if (!files || files.length === 0) {
    //         return this.SendResponse(ResponseEnum.Error, 'No files were uploaded.');
    //     }
    //     const uploadedImages = [];
    //     for (const file of files) {
    //         const image = new ProductImageModel();
    //         image.product_id = productId;
    //         image.uploaded_image = file.path.replace(/\\/g, '/');
    //         image.file_name = file.originalname;
    //         image.created_by_id = UserId;
    //         image.created_on = new Date();
    //         await this._ProductImageService.UploadFiles(image, UserId);
    //         uploadedImages.push({
    //             imageUrl: `${process.env.DOMAIN_NAME}/uploads/${file.filename}`
    //         });
    //     }
    //     return this.SendResponse(ResponseEnum.Success, 'Files uploaded successfully.', { uploadedImages });
    // }




    @Get('GetImage/:id')
    async GetImage(@Param('id') id: string) {
        const productImage = await this._ProductImageService.GetImageUrl(id);
        if (!productImage) {
            return this.SendResponse(ResponseEnum.Error, 'Image not found.');
        }
        return productImage;
    }

    @Get('GetImagesByProductId/:product_id')
    async GetImagesByProductId(@Param('product_id') productId: string) {
        const images = await this._ProductImageService.GetImagesByProductId(productId);
        if (images.length === 0) {
            return this.SendResponse(ResponseEnum.Error, 'No images found for the given product ID.');
        }
        return images;
    }

    @Delete('DeleteImageById/:id')
    async DeleteImage(@Param('id') imageId: string, @CurrentUser() UserId: string) {
        await this._ProductImageService.DeleteImage(imageId, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
    }


    @Post('UploadFiles/:product_id')
    @UseInterceptors(FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: (req, file, cb) => {
            const storagePath = process.env.STORAGE;
            if (!fs.existsSync(storagePath)) {
                fs.mkdirSync(storagePath, { recursive: true });
            }
            cb(null, storagePath);
        },
        filename: (req, file, cb) => {
            const productId = req.params.product_id;
            const storagePath = process.env.STORAGE;
            const ext = path.extname(file.originalname);
            const baseName = `Product-${productId}`;
            const filesInDir = fs.readdirSync(storagePath).filter((file) => {
                return file.startsWith(baseName) && file.endsWith(ext);
            });
            let fileName = `${baseName}${ext}`;
            if (filesInDir.length > 0) {
                const existingNumbers = filesInDir.map((file) => {
                    const match = file.match(/-(\d+)\./);
                    return match ? parseInt(match[1], 10) : 0;
                });
                const maxNumber = Math.max(...existingNumbers);
                const nextNumber = maxNumber + 1;
                fileName = `${baseName}-${nextNumber}${ext}`;
            }

            cb(null, fileName);
        },
        }),
    }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                files: { type: 'array', items: { type: 'string', format: 'binary', description: 'The files to upload' } },
            },
        },
    })
    async UploadFiles(
        @Param('product_id') productId: string,
        @CurrentUser() UserId: string,
        @UploadedFiles() files: Express.Multer.File[],
        @Body() ProductImageData: ProductImageModel
    ) {
        if (!files || files.length === 0) {
            return this.SendResponse(ResponseEnum.Error, 'No files were uploaded.');
        }
        const uploadedImages = [];
        for (const file of files) {
            const image = new ProductImageModel();
            image.product_id = productId;
            image.uploaded_image = file.path.replace(/\\/g, '/');
            image.file_name = `${process.env.DOMAIN_NAME}/storage/${file.filename}`;
            const nextDisplayOrder = await this._CommonService.getLastDisplayOrder('product_image');
            image.display_order = nextDisplayOrder;
            image.created_by_id = UserId;
            image.created_on = new Date();
            await this._ProductImageService.UploadFiles(image, UserId);
            uploadedImages.push({
                imageUrl: `${process.env.DOMAIN_NAME}/storage/${file.filename}`
            });
        }
        return this.SendResponse(ResponseEnum.Success, 'Files uploaded successfully.', { uploadedImages });
    }


    @Put('ImgeDisplayOrderUpdate/:Id')
    async Update(@Param('Id') Id: string, @Body() ProductImageData: ProductImageUpdateModel, @CurrentUser() UserId: string) {
        await this._ProductImageService.Update(Id, ProductImageData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

}
