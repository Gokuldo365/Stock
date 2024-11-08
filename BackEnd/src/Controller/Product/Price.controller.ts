import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { PriceModel } from '@Model/Product/Price.model';
import { PriceService } from '@Root/Service/Product/price.service';

@Controller({ path: "Price", version: '1' })
@ApiTags("Price")
export class PriceController extends JWTAuthController {

    constructor(private _PriceService: PriceService) {
        super()
    }

    @Get('List')
    async List() {
        const PriceListData = await this._PriceService.GetAll();
        return this.SendResponseData(PriceListData);
    }

    @Post('Insert')
    async Insert(@Body() PriceData: PriceModel, @CurrentUser() UserId: string) {
        const PriceDataId = await this._PriceService.Insert(PriceData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
    }
}

