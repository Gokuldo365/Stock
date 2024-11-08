import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { MetalService } from '@Root/Service/Product/Metal.service';
import { MetalModel } from '@Model/Product/Metal.model';

@Controller({ path: "Metal", version: '1' })
@ApiTags("Metal")
export class MetalController extends JWTAuthController {

    constructor(private _MetalService: MetalService) {
        super()
    }

    @Get('List')
    async List() {
        const MetalListData = await this._MetalService.GetAll();
        return this.SendResponseData(MetalListData);
    }

    @Get('ById/:Id')
    async ById(@Param('Id') Id: string) {
        const MetalData = await this._MetalService.GetById(Id);
        return this.SendResponseData(MetalData);
    }

    @Post('Insert')
    async Insert(@Body() MetalData: MetalModel, @CurrentUser() UserId: string) {
        const MetalDataId = await this._MetalService.Insert(MetalData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created, MetalDataId.id);
    }

    @Put('Update/:Id')
    async Update(@Param('Id') Id: string, @Body() MetalData: MetalModel, @CurrentUser() UserId: string) {
        await this._MetalService.Update(Id, MetalData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

    @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string) {
        try {
            await this._MetalService.Delete(Id);
            return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
        }
        catch (exception) {
            if (exception.code == "ER_NO_REFERENCED_ROW_2") {
                var matches = exception.message.match("FOREIGN KEY (.*?) REFERENCES");
                const MessageText = `${matches[1].replace("(`", '').replace("`)", '')} is invalid`;
                return this.SendResponse(ResponseEnum.Error, MessageText);
            }
            else {
                return this.SendResponse(ResponseEnum.Error, 'Can Not Delete Metal Beacuse Its Already Used');
            }
        }
    }
}