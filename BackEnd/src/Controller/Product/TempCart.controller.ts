import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { TempCartService } from '@Root/Service/Product/TempCart.service';
import { TempCartModel } from '@Model/Product/TempCart.model';

@Controller({ path: "TempCart", version: '1' })
@ApiTags("TempCart")
export class TempCartController extends JWTAuthController {

    constructor(private _TempCartService: TempCartService) {
        super()
    }

    @Get('List')
    async List() {
        const TempCartListData = await this._TempCartService.GetAll();
        return this.SendResponseData(TempCartListData);
    }

    @Get('ById/:UserId')
    async ById(@Param('UserId') UserId: string) {
        const TempCartData = await this._TempCartService.GetById(UserId);
        return this.SendResponseData(TempCartData);
    }

    @Post('Insert')
    async Insert(@Body() TempCartData: TempCartModel, @CurrentUser() UserId: string) {
        const TempCartDataId = await this._TempCartService.Insert(TempCartData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created, TempCartDataId.id);
    }

    @Put('Update/:Id')
    async Update(@Param('Id') Id: string, @Body() TempCartData: TempCartModel, @CurrentUser() UserId: string) {
        await this._TempCartService.Update(Id, TempCartData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

    @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string) {
        await this._TempCartService.Delete(Id);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
    }
}
