import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { OrderDetailFilterModel, OrderDetailModel } from '@Model/Product/OrderDetail.model';
import { OrderDetailService } from '@Root/Service/Product/OrderDetail.service';

@Controller({ path: "OrderDetail", version: '1' })
@ApiTags("OrderDetail")
export class OrderDetailController extends JWTAuthController {

  constructor(private _OrderDetailService: OrderDetailService

  ) {
    super()
  }

  @Post('OrderList')
  async GetAllOrder(@Body() OrderDetailFilterModel: OrderDetailFilterModel) {
    const OrderDetailListData = await this._OrderDetailService.GetAllOrder(OrderDetailFilterModel);
    return this.SendResponseData(OrderDetailListData);
  }

  @Get('List')
  async List() {
    const OrderDetailListData = await this._OrderDetailService.GetAll();
    return this.SendResponseData(OrderDetailListData);
  }

  @Get('ByOrderId/:Id')
  async ById(@Param('Id') OrderId: string) {
    const OrderDetailData = await this._OrderDetailService.GetById(OrderId);
    return this.SendResponseData(OrderDetailData);
  }

  @Post('Insert')
  async Insert(@Body() OrderDetailData: OrderDetailModel, @CurrentUser() UserId: string) {
    const OrderDetailInsertData = await this._OrderDetailService.Insert(OrderDetailData, UserId);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created,OrderDetailInsertData[0].order_id);
  }

  // @Put('Update/:OrderId')
  // async Update(@Param('OrderId') OrderId: string, @Body() OrderDetailData: OrderDetailModel, @CurrentUser() UserId: string) {
  //   await this._OrderDetailService.Update(OrderId, OrderDetailData, UserId);
  //   return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
  // }

  // @Delete('Delete/:Id')
  // async Delete(@Param('Id') Id: string, @CurrentUser() UserId: string) {
  //   await this._OrderDetailService.Delete(Id, UserId);
  //   return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
  // }
}
