import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { AttributeService } from '@Root/Service/Product/Attribute.service';
import { AttributeModel } from '@Model/Product/Attribute.model';

@Controller({ path: "Attribute", version: '1' })
@ApiTags("Attribute")
export class AttributeController extends JWTAuthController {

  constructor(private _AttributeService: AttributeService) {
    super()
  }

  @Get('List')
  async List() {
    const AttributeListData = await this._AttributeService.GetAll();
    return this.SendResponseData(AttributeListData);
  }

  @Get('ById/:Id')
  async ById(@Param('Id') Id: string) {
    const AttributeData = await this._AttributeService.GetById(Id);
    return this.SendResponseData(AttributeData);
  }

  @Post('Insert')
  async Insert(@Body() AttributeData: AttributeModel, @CurrentUser() UserId: string) {
    const AttributeInsertData = await this._AttributeService.Insert(AttributeData, UserId);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created,AttributeInsertData.id
    );
  }

  @Put('Update/:Id')
  async Update(@Param('Id') Id: string, @Body() AttributeData: AttributeModel, @CurrentUser() UserId: string) {
    await this._AttributeService.Update(Id, AttributeData, UserId);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
  }

  @Delete('Delete/:Id')
  async Delete(@Param('Id') Id: string) {
      try {
          await this._AttributeService.Delete(Id);
          return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
      }
      catch (exception) {
          if (exception.code == "ER_NO_REFERENCED_ROW_2") {
              var matches = exception.message.match("FOREIGN KEY (.*?) REFERENCES");
              const MessageText = `${matches[1].replace("(`", '').replace("`)", '')} is invalid`;
              return this.SendResponse(ResponseEnum.Error, MessageText);
          }
          else {
              return this.SendResponse(ResponseEnum.Error, 'Can Not Delete Attribute Beacuse Its Already Used');
          }
      }
  }

  @Get('AttributeDetailFullList')
      async AttributeDetailFullList() {
        const ListData = await this._AttributeService.AttributeDetailFullList();
        return this.SendResponseData(ListData);
      }
}
