import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { ProductVariantsModel } from '@Model/Product/ProductVariants.model';
import { ProductVariantsService } from '@Root/Service/Product/ProductVariants.service';

@Controller({ path: "ProductVariants", version: '1' })
@ApiTags("ProductVariants")
export class ProductVariantsController extends JWTAuthController {

    constructor(private _ProductVariantsService: ProductVariantsService) {
        super()
    }

    @Get('List')
    async List() {
        const ProductVariantsListData = await this._ProductVariantsService.GetAll();
        return this.SendResponseData(ProductVariantsListData);
    }

    @Get('ProductVariantsListBy/:Id')
    async ProductVariantsListByProductId(@Param('Id') Id: string) {
        const ProductVariantsListByProductIdData = await this._ProductVariantsService.ProductVariantsListByProductId(Id);
        return this.SendResponseData(ProductVariantsListByProductIdData);
    }

    @Get('ById/:Id')
    async ById(@Param('Id') Id: string) {
        const ProductVariantsData = await this._ProductVariantsService.GetById(Id);
        return this.SendResponseData(ProductVariantsData);
    }

    @Post('Insert')
    async Insert(@Body() ProductVariantsData: ProductVariantsModel, @CurrentUser() UserId: string) {
       const Data =   await this._ProductVariantsService.Insert(ProductVariantsData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created,Data);
    }

    // @Put('Update/:Id')
    // async Update(@Param('Id') Id: string, @Body() ProductVariantsData: ProductVariantsModel, @CurrentUser() UserId: string) {
    //     await this._ProductVariantsService.Update(Id, ProductVariantsData, UserId);
    //     return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    // }

    @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string) {
        try {
            await this._ProductVariantsService.Delete(Id);
            return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
        }
        catch (exception) {
            if (exception.code == "ER_NO_REFERENCED_ROW_2") {
                var matches = exception.message.match("FOREIGN KEY (.*?) REFERENCES");
                const MessageText = `${matches[1].replace("(`", '').replace("`)", '')} is invalid`;
                return this.SendResponse(ResponseEnum.Error, MessageText);
            }
            else {
                return this.SendResponse(ResponseEnum.Error, 'Can Not Delete Product Variants Beacuse Its Already Used');
            }
        }
    }
}
