import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { EmployeeService } from '@Root/Service/Product/Employee.service';
import { EmployeeModel } from '@Model/Product/Employee.model';

@Controller({ path: "Employee", version: '1' })
@ApiTags("Employee")
export class EmployeeController extends JWTAuthController {

    constructor(private _EmployeeService: EmployeeService) {
        super()
    }

    @Get('List')
    async List() {
        const EmployeeListData = await this._EmployeeService.GetAll();
        return this.SendResponseData(EmployeeListData);
    }

    @Get('ById/:Id')
    async ById(@Param('Id') Id: string) {
        const EmployeeData = await this._EmployeeService.GetById(Id);
        return this.SendResponseData(EmployeeData);
    }

    @Post('Insert')
    async Insert(@Body() EmployeeData: EmployeeModel, @CurrentUser() UserId: string) {
        const EmployeeDataId = await this._EmployeeService.Insert(EmployeeData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created, EmployeeDataId.id);
    }

    @Put('Update/:Id')
    async Update(@Param('Id') Id: string, @Body() EmployeeData: EmployeeModel, @CurrentUser() UserId: string) {
        await this._EmployeeService.Update(Id, EmployeeData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

    @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string) {
        try {
            await this._EmployeeService.Delete(Id);
            return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
        }
        catch (exception) {
            if (exception.code == "ER_NO_REFERENCED_ROW_2") {
                var matches = exception.message.match("FOREIGN KEY (.*?) REFERENCES");
                const MessageText = `${matches[1].replace("(`", '').replace("`)", '')} is invalid`;
                return this.SendResponse(ResponseEnum.Error, MessageText);
            }
            else {
                return this.SendResponse(ResponseEnum.Error, 'Can Not Delete Employee Beacuse Its Already Used');
            }
        }
    }
}