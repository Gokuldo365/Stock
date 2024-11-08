import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { BranchService } from '@Root/Service/Product/Branch.service';
import { BranchModel } from '@Model/Product/Branch.model';

@Controller({ path: "Branch", version: '1' })
@ApiTags("Branch")
export class BranchController extends JWTAuthController {

    constructor(private _BranchService: BranchService) {
        super()
    }

    @Get('List')
    async List() {
        const BranchListData = await this._BranchService.GetAll();
        return this.SendResponseData(BranchListData);
    }

    @Get('ById/:Id')
    async ById(@Param('Id') Id: string) {
        const BranchData = await this._BranchService.GetById(Id);
        return this.SendResponseData(BranchData);
    }

    @Post('Insert')
    async Insert(@Body() BranchData: BranchModel, @CurrentUser() UserId: string) {
        const BranchDataId = await this._BranchService.Insert(BranchData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created, BranchDataId.id);
    }

    @Put('Update/:Id')
    async Update(@Param('Id') Id: string, @Body() BranchData: BranchModel, @CurrentUser() UserId: string) {
        await this._BranchService.Update(Id, BranchData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

    @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string) {
        try {
            await this._BranchService.Delete(Id);
            return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
        }
        catch (exception) {
            if (exception.code == "ER_NO_REFERENCED_ROW_2") {
                var matches = exception.message.match("FOREIGN KEY (.*?) REFERENCES");
                const MessageText = `${matches[1].replace("(`", '').replace("`)", '')} is invalid`;
                return this.SendResponse(ResponseEnum.Error, MessageText);
            }
            else {
                return this.SendResponse(ResponseEnum.Error, 'Can Not Delete Branch Beacuse Its Already Used');
            }
        }
    }
}
