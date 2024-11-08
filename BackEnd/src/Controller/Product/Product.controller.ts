import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CurrentUser } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { ProductService } from '@Root/Service/Product/Product.service';
import { CatalogProductFilterModel, GlobalFilterModel, ProductFilterListModel, ProductModel } from '@Model/Product/Product.model';

@Controller({ path: "Product", version: '1' })

@ApiTags("Product")
export class ProductController extends JWTAuthController {

  constructor(private _ProductService: ProductService) {
    super()
  }

  @Get('List')
  async List() {
    const ProductListData = await this._ProductService.GetAll();
    return this.SendResponseData(ProductListData);
  }

  @Post('ProductFilterList')
  async ProductFilterList(@Body() ProductFilterListData : ProductFilterListModel) {
    const ProductListData = await this._ProductService.ProductFilterList(ProductFilterListData);
    return this.SendResponseData(ProductListData);
  }

  @Get('ById/:Id')
  async ById(@Param('Id') Id: string) {
    const ProductData = await this._ProductService.GetById(Id);
    return this.SendResponseData(ProductData);
  }

  @Post('Insert')
  async Insert(@Body() ProductData: ProductModel, @CurrentUser() UserId: string) {
    const Data = await this._ProductService.Insert(ProductData, UserId);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created,Data.id);
  }

  @Put('Update/:Id')
  async Update(@Param('Id') Id: string, @Body() ProductData: ProductModel, @CurrentUser() UserId: string) {
    const Data = await this._ProductService.Update(Id, ProductData, UserId);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated,Data.id);
  }

  @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string) {
        try {
            await this._ProductService.Delete(Id);
            return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
        }
        catch (exception) {
            if (exception.code == "ER_NO_REFERENCED_ROW_2") {
                var matches = exception.message.match("FOREIGN KEY (.*?) REFERENCES");
                const MessageText = `${matches[1].replace("(`", '').replace("`)", '')} is invalid`;
                return this.SendResponse(ResponseEnum.Error, MessageText);
            }
            else {
                return this.SendResponse(ResponseEnum.Error, 'Can Not Delete Product Beacuse Its Already Used');
            }
        }
    }

  @Get('MixedMaterialBy/:Id')
  async ByProductId(@Param('Id') ProductMixedMaterialId: string) {
    const ProductMixedMaterialData = await this._ProductService.GetMixedMaterialProductId(ProductMixedMaterialId);
    return this.SendResponseData(ProductMixedMaterialData);
  }


  @Post('CatalogFilter')
  async CatalogFilter(@Body() CatalogProductFilterModelData : CatalogProductFilterModel) {
    const CatalogFliterData =  await this._ProductService.CatalogFilter(CatalogProductFilterModelData);
    return this.SendResponseData(CatalogFliterData);
  }

  @Post('GlobalNameFilter')
  async GlobalNameFilter(@Body() GlobalFilterModel: GlobalFilterModel) {
    const CatalogFliterData =  await this._ProductService.GlobalProductNameCodeFilter(GlobalFilterModel);
    return this.SendResponseData(CatalogFliterData);
  }

}
