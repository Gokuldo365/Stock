import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { AttributeDetailService } from '@Root/Service/Product/AttributeDetail.service';
import { AttributeDetailModel } from '@Model/Product/AttributeDetail.model';


@Controller({ path: "AttributeDetail", version: '1' })
@ApiTags("AttributeDetail")
export class AttributeDetailController extends JWTAuthController {

  constructor(private _AttributeDetailService: AttributeDetailService) {
    super()
  }

  @Get('List')
  async List() {
    const AttributeDetailListData = await this._AttributeDetailService.GetAll();
    return this.SendResponseData(AttributeDetailListData);
  }

  @Get('ById/:Id')
  async ById(@Param('Id') Id: string) {
    const AttributeDetailData = await this._AttributeDetailService.GetById(Id);
    return this.SendResponseData(AttributeDetailData);
  }

  @Get('ByAttributeId/:Id')
  async ByAttributeId(@Param('Id') AttributeId: string) {
    const AttributeDetailData = await this._AttributeDetailService.GetAttributeId(AttributeId);
    return this.SendResponseData(AttributeDetailData);
  }

  @Post('Insert')
  async Insert(@Body() AttributeDetailData: AttributeDetailModel, @CurrentUser() UserId: string) {
   const AttributeData =  await this._AttributeDetailService.Insert(AttributeDetailData, UserId);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created,AttributeData.id);
  }

  @Put('Update/:Id')
  async Update(@Param('Id') Id: string, @Body() AttributeDetailData: AttributeDetailModel, @CurrentUser() UserId: string) {
    await this._AttributeDetailService.Update(Id, AttributeDetailData, UserId);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
  }

  @Delete('Delete/:Id')
  async Delete(@Param('Id') Id: string) {
    await this._AttributeDetailService.Delete(Id);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
  }
}
