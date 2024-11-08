import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { StockEntryDetailOtherWeightService } from '@Root/Service/Product/StockEntryDetailOtherWeight.service';
import { StockEntryDetailOtherWeightModel } from '@Model/Product/StockEntryDetailOtherWeight.model';

@Controller({ path: "StockEntryDetailOtherWeight", version: '1' })
@ApiTags("StockEntryDetailOtherWeight")
export class StockEntryDetailOtherWeightController extends JWTAuthController {

      constructor(private _StockEntryDetailOtherWeightService: StockEntryDetailOtherWeightService
      ) { super() }

      @Get('List')
      async List() {
        const SedOtherWeightListData = await this._StockEntryDetailOtherWeightService.GetAll();
        return this.SendResponseData(SedOtherWeightListData);
      }

      @Get('SedOtherWeight/:Id')
      async ById(@Param('Id') SedOtherWeightId: string) {
        const SedOtherWeightData = await this._StockEntryDetailOtherWeightService.GetById(SedOtherWeightId);
        return this.SendResponseData(SedOtherWeightData);
      }

      @Post('Insert')
      async Insert(@Body() SedOtherWeightData: StockEntryDetailOtherWeightModel, @CurrentUser() UserId: string) {
        const Data = await this._StockEntryDetailOtherWeightService.Insert(SedOtherWeightData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created,Data.id);
      }

      @Put('Update/:SedOtherWeightId')
      async Update(@Param('SedOtherWeightId') SedOtherWeightId: string, @Body() SedOtherWeightData: StockEntryDetailOtherWeightModel, @CurrentUser() UserId: string) {
        await this._StockEntryDetailOtherWeightService.Update(SedOtherWeightId, SedOtherWeightData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
      }

      @Delete('Delete/:Id')
      async Delete(@Param('Id') Id: string) {
        await this._StockEntryDetailOtherWeightService.Delete(Id);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
      }
}
