import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { MixedMaterialService } from '@Root/Service/Product/MixedMaterial.service';
import { MixedMaterialModel } from '@Model/Product/MixedMaterial.model';

@Controller({ path: "MixedMaterial", version: '1' })
@ApiTags("MixedMaterial")
export class MixedMaterialController extends JWTAuthController {

    constructor(private _MixedMaterialService: MixedMaterialService) {
        super()
    }

    @Get('List')
    async List() {
        const MixedMaterialListData = await this._MixedMaterialService.GetAll();
        return this.SendResponseData(MixedMaterialListData);
    }

    @Get('ById/:Id')
    async ById(@Param('Id') Id: string) {
        const MixedMaterialData = await this._MixedMaterialService.GetById(Id);
        return this.SendResponseData(MixedMaterialData);
    }

    @Post('Insert')
    async Insert(@Body() MixedMaterialData: MixedMaterialModel, @CurrentUser() UserId: string) {
        const MixedMaterialDataId = await this._MixedMaterialService.Insert(MixedMaterialData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created, MixedMaterialDataId.id);
    }

    @Put('Update/:Id')
    async Update(@Param('Id') Id: string, @Body() MixedMaterialData: MixedMaterialModel, @CurrentUser() UserId: string) {
        await this._MixedMaterialService.Update(Id, MixedMaterialData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

    @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string) {
        try {
            await this._MixedMaterialService.Delete(Id);
            return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
        }
        catch (exception) {
            if (exception.code == "ER_NO_REFERENCED_ROW_2") {
                var matches = exception.message.match("FOREIGN KEY (.*?) REFERENCES");
                const MessageText = `${matches[1].replace("(`", '').replace("`)", '')} is invalid`;
                return this.SendResponse(ResponseEnum.Error, MessageText);
            }
            else {
                return this.SendResponse(ResponseEnum.Error, 'Can Not Delete Mixed Material Beacuse Its Already Used');
            }
        }
    }
}