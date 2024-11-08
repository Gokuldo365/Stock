import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { CurrentUser } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { StockEntryDetailService } from '@Root/Service/Product/StockEntryDetail.service';
import { RateCutCalculationModel, StockEntryAndDetailModel, StockEntryDetailModel } from '@Model/Product/StockEntryDetail.model';
import { StockEntryProductModel } from '@Model/Product/StockEntryProduct.model';

@Controller({ path: "StockEntryDetail", version: '1' })
@ApiTags("StockEntryDetail")
export class StockEntryDetailController extends JWTAuthController {

      constructor(
        private _StockEntryDetailService: StockEntryDetailService
      ) { super() }


      @Post('Insert')
      async Insert(@Body() StockEntryAndDetailData: StockEntryAndDetailModel, @CurrentUser() UserId: string) {
        const Data = await this._StockEntryDetailService.Insert(StockEntryAndDetailData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created,Data.id);
      }

      @Post('StockEntryDeailInsert')
      async StockEntryDeailInsert(@Body() StockEntryDetailData : StockEntryDetailModel, @CurrentUser() UserId: string) {
        const Data = await this._StockEntryDetailService.StockEntryDeailInsert(StockEntryDetailData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created,Data.id);
      }

      @Put('Update/:StockEntryDetailId')
      async Update(@Param('StockEntryDetailId') StockEntryDetailId: string, @Body() StockEntryDetailData : StockEntryDetailModel, @CurrentUser() UserId: string) {
        await this._StockEntryDetailService.Update(StockEntryDetailId, StockEntryDetailData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
      }



      @Get('List/:Id')
      async List(@Param('Id') StockEntryId: string) {
        const StockEntryDetailListData = await this._StockEntryDetailService.GetAll(StockEntryId);
        return this.SendResponseData(StockEntryDetailListData);
      }

      @Get('StockEntryDetail/:Id')
      async ById(@Param('Id') StockEntryDetailId: string) {
        const StockEntryDetailData = await this._StockEntryDetailService.GetById(StockEntryDetailId);
        return this.SendResponseData(StockEntryDetailData);
      }

      // @Post('Insert')
      // async Insert(@Body() StockEntryDetailData: StockEntryDetailModel, @Req() request: Request, @CurrentUser() UserId: string) {
      //   // const Data = await this._StockEntryDetailService.Insert(StockEntryDetailData, UserId);
      //   // const Data = await this._StockEntryDetailService.Insert(request.body, UserId);
      //   return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created,Data.id);
      // }

      // @Put('Update/:StockEntryDetailId')
      // async Update(@Param('StockEntryDetailId') StockEntryDetailId: string, @Body() StockEntryDetailData: StockEntryDetailModel, @Req() request: Request, @CurrentUser() UserId: string) {
      //   // await this._StockEntryDetailService.Update(StockEntryDetailId, StockEntryDetailData, UserId);
      //   await this._StockEntryDetailService.Update(StockEntryDetailId, request.body, UserId);
      //   return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
      // }

      @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string) {
        try {
            await this._StockEntryDetailService.Delete(Id);
            return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
        }
        catch (exception) {
            if (exception.code == "ER_NO_REFERENCED_ROW_2") {
                var matches = exception.message.match("FOREIGN KEY (.*?) REFERENCES");
                const MessageText = `${matches[1].replace("(`", '').replace("`)", '')} is invalid`;
                return this.SendResponse(ResponseEnum.Error, MessageText);
            }
            else {
                return this.SendResponse(ResponseEnum.Error, 'Can Not Delete Stock Entry Detail Beacuse Its Already Used');
            }
        }
    }

      @Get('StockEntryDetailList/:StockEntryId')
      async StockEntryDetailList(@Param('StockEntryId') StockEntryId: string) {
        const ListData = await this._StockEntryDetailService.StockEntryDetailList(StockEntryId);
        return this.SendResponseData(ListData);
      }

      @Get('StockEntryDetailById/:StockEntryDetailId')
      async StockEntryDetailById(@Param('StockEntryDetailId') StockEntryDetailId: string) {
        const ListData = await this._StockEntryDetailService.StockEntryDetailById(StockEntryDetailId);
        return this.SendResponseData(ListData);
      }


      @Post('StockProductList')
      async StockProductList(@Body() StockEntryProductData: StockEntryProductModel, @CurrentUser() UserId: string) {
        const ProductListData = await this._StockEntryDetailService.StockProductList(StockEntryProductData);
        return this.SendResponseData(ProductListData);
      }

      @Get('StockVarientList/:Id')
      async StockVarientList(@Param('Id') Product_id: string) {
        const ListData = await this._StockEntryDetailService.StockVarientList(Product_id);
        return this.SendResponseData(ListData);
      }

      @Get('StockMixedMaterialList/:Id')
      async StockMixedMaterialList(@Param('Id') Product_id: string) {
        const ListData = await this._StockEntryDetailService.StockMixedMaterialList(Product_id);
        return this.SendResponseData(ListData);
      }

      @Post('IssueStockProductList')
      async OutwareStockProductList(@Body() StockEntryProductData: StockEntryProductModel, @CurrentUser() UserId: string) {
        const ProductListData = await this._StockEntryDetailService.IssueStockProductList(StockEntryProductData);
        return this.SendResponseData(ProductListData);
      }

      @Get('IssueVarientList/:Id')
      async OutwardVarientList(@Param('Id') Product_id: string) {
        const ListData = await this._StockEntryDetailService.IssueVarientList(Product_id);
        return this.SendResponseData(ListData);
      }

      @Get('IssueMixedMaterialList/:Id')
      async OutwardMixedMaterialList(@Param('Id') Product_id: string) {
        const ListData = await this._StockEntryDetailService.IssueMixedMaterialList(Product_id);
        return this.SendResponseData(ListData);
      }
}
