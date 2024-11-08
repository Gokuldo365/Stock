import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { CompanyModel } from '@Model/Admin/Company.model';
import { CurrentUser } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { CompanyService } from '@Service/Admin/Company.service';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';

@Controller({ path: "Company", version: '1' })
@ApiTags("Company")
export class CompanyController extends JWTAuthController {

  constructor(private _CompanyService: CompanyService) {
    super()
  }

  @Get('List')
  async List() {
    const CompanyData = await this._CompanyService.GetAll();
    return CompanyData;
  }

  @Post('Insert')
  async Insert(@Body() CompanyData: CompanyModel, @CurrentUser() UserId: string) {
    await this._CompanyService.Insert(CompanyData, UserId);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created);
  }

  @Put('CompanyUpdate/:Id')
  async CompanyUpdate(@Param('Id') Id: string, @Body() CompanyData: CompanyModel, @CurrentUser() UserId: string) {
    await this._CompanyService.Update(Id, CompanyData, UserId);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
  }

  @Delete('Delete/:Id')
    async Delete(@Param('Id') Id: string) {
        const CompanyData = await this._CompanyService.Delete(Id);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
    }
}