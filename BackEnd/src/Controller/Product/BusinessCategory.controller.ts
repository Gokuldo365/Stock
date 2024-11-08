import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { BusinessCategoryModel } from '@Model/Product/BusinessCategory';
import { BusinessCategoryService } from '@Root/Service/Product/BusinessCategory.service';

@Controller({ path: "BusinessCategory", version: '1' })
@ApiTags("BusinessCategory")
export class BusinessCategoryController extends JWTAuthController {

    constructor(private _BusinessCategoryService: BusinessCategoryService) {
        super()
    }

    @Get('List')
    async List() {
        const BusinessCategoryListData = await this._BusinessCategoryService.GetAll();
        return this.SendResponseData(BusinessCategoryListData);
    }

    @Get('ById/:Id')
    async ById(@Param('Id') Id: string) {
        const BusinessCategoryData = await this._BusinessCategoryService.GetById(Id);
        return this.SendResponseData(BusinessCategoryData);
    }

    @Post('Insert')
    async Insert(@Body() BusinessCategoryData: BusinessCategoryModel, @CurrentUser() UserId: string) {
        const BusinessCategoryDataId = await this._BusinessCategoryService.Insert(BusinessCategoryData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created, BusinessCategoryDataId.id);
    }

    @Put('Update/:Id')
    async Update(@Param('Id') Id: string, @Body() BusinessCategoryData: BusinessCategoryModel, @CurrentUser() UserId: string) {
        await this._BusinessCategoryService.Update(Id, BusinessCategoryData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

    @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string) {
        try {
            await this._BusinessCategoryService.Delete(Id);
            return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
        }
        catch (exception) {
            if (exception.code == "ER_NO_REFERENCED_ROW_2") {
                var matches = exception.message.match("FOREIGN KEY (.*?) REFERENCES");
                const MessageText = `${matches[1].replace("(`", '').replace("`)", '')} is invalid`;
                return this.SendResponse(ResponseEnum.Error, MessageText);
            }
            else {
                return this.SendResponse(ResponseEnum.Error, 'Can Not Delete BusinessCategory Beacuse Its Already Used');
            }
        }
    }
}
