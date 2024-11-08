import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JWTAuthController } from "../JWTAuth.controller";
import { RateCutCalculationModel } from "@Model/Product/StockEntryDetail.model";
import { StockRateCutService } from "@Root/Service/Product/StockRateCutCalculation.service";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";
import { CurrentUser } from "@Root/Helper/Common.helper";

@Controller({ path: "StockRateCut", version: '1' })
@ApiTags("StockRateCut")
export class StockRateCutController extends JWTAuthController {

  constructor(
    private _StockRateCutService: StockRateCutService
  ) { super() }

  @Get('List')
  async List() {
      const PurityListData = await this._StockRateCutService.GetAll();
      return this.SendResponseData(PurityListData);
  }

  @Post('RateCutCalculation')
  async RateCutCalculation(@Body() RateCutCalculationData : RateCutCalculationModel, @CurrentUser() UserId: string) {
  await this._StockRateCutService.RateCutCalculation(RateCutCalculationData, UserId);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
  }

}
