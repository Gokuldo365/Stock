import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { BusinessService } from '@Root/Service/Product/Business.service';
import { BusinessModel } from '@Model/Product/Business.model';

@Controller({ path: "Business", version: '1' })
@ApiTags("Business")
export class BusinessController extends JWTAuthController {

    constructor(private _BusinessService: BusinessService) {
        super()
    }

    @Get('List')
    async List() {
        const BusinessListData = await this._BusinessService.GetAll();
        return this.SendResponseData(BusinessListData);
    }

    @Get('ById/:Id')
    async ById(@Param('Id') Id: string) {
        const BusinessData = await this._BusinessService.GetById(Id);
        return this.SendResponseData(BusinessData);
    }

    @Post('Insert')
    async Insert(@Body() BusinessData: BusinessModel, @CurrentUser() UserId: string) {
        const BusinessDataId = await this._BusinessService.Insert(BusinessData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created, BusinessDataId.id);
    }

    @Put('Update/:Id')
    async Update(@Param('Id') Id: string, @Body() BusinessData: BusinessModel, @CurrentUser() UserId: string) {
        await this._BusinessService.Update(Id, BusinessData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

    @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string) {
        try {
            await this._BusinessService.Delete(Id);
            return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
        }
        catch (exception) {
            if (exception.code == "ER_NO_REFERENCED_ROW_2") {
                var matches = exception.message.match("FOREIGN KEY (.*?) REFERENCES");
                const MessageText = `${matches[1].replace("(`", '').replace("`)", '')} is invalid`;
                return this.SendResponse(ResponseEnum.Error, MessageText);
            }
            else {
                return this.SendResponse(ResponseEnum.Error, 'Can Not Delete Business Beacuse Its Already Used');
            }
        }
    }
}
