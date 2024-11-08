import { Body, Controller, Get, Param, Post, Put, Delete } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JWTAuthController } from "../JWTAuth.controller";
import { CurrentUser } from "@Root/Helper/Common.helper";
import { ResponseEnum } from "@Root/Helper/Enum/ResponseEnum";
import { UnitOfMeasurementService } from "@Root/Service/Product/UnitOfMeasurement.service";
import { UnitOfMeasurementModel } from "@Model/Product/UnitOfMeasurement.model";


@Controller({ path: 'UnitOfMeasurement', version: '1' })
@ApiTags('UnitOfMeasurement')
export class UnitOfMeasurementController extends JWTAuthController {

    constructor(private _UnitOfMeasurement: UnitOfMeasurementService) {
        super()
    }

    @Get('List')
    async List() {
        const UnitOfMeasurementList = await this._UnitOfMeasurement.GetAll();
        return this.SendResponseData(UnitOfMeasurementList);
    }

    @Get('ById/:Id')
    async ById(@Param('Id') Id: string) {
        const UnitOfMeasurementDataId = await this._UnitOfMeasurement.GetById(Id);
        return this.SendResponseData(UnitOfMeasurementDataId);
    }

    @Post('Insert')
    async Insert(@Body() UnitOfMeasurementdata: UnitOfMeasurementModel, @CurrentUser() UserId: string) {
        const _unitOfMeasurementData = await this._UnitOfMeasurement.Insert(UnitOfMeasurementdata, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created, UnitOfMeasurementdata.id);
    }

    @Put('Update/:Id')
    async Update(@Param('Id') Id: string, @Body() UnitOfMeasurementData: UnitOfMeasurementModel, @CurrentUser() UserId: string) {
        const _UnitOfMeasurementData = await this._UnitOfMeasurement.Update(Id, UnitOfMeasurementData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

    @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string) {
        const _UnitOfMeasurementData = await this._UnitOfMeasurement.Delete(Id);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
    }
}