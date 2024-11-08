import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { PurityService } from '@Root/Service/Product/Purity.service';
import { PurityModel } from '@Model/Product/Purity.model';

@Controller({ path: "Purity", version: '1' })
@ApiTags("Purity")
export class PurityController extends JWTAuthController {

    constructor(private _PurityService: PurityService) {
        super()
    }

    @Get('List')
    async List() {
        const PurityListData = await this._PurityService.GetAll();
        return this.SendResponseData(PurityListData);
    }

    @Get('ById/:Id')
    async ById(@Param('Id') Id: string) {
        const PurityData = await this._PurityService.GetById(Id);
        return this.SendResponseData(PurityData);
    }

    @Post('Insert')
    async Insert(@Body() PurityData: PurityModel, @CurrentUser() UserId: string) {
        const PurityDataId = await this._PurityService.Insert(PurityData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created, PurityDataId.id);
    }

    @Put('Update/:Id')
    async Update(@Param('Id') Id: string, @Body() PurityData: PurityModel, @CurrentUser() UserId: string) {
        await this._PurityService.Update(Id, PurityData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

    @Delete('Delete/:Id')
  async Delete(@Param('Id') Id: string) {
      try {
          await this._PurityService.Delete(Id);
          return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
      }
      catch (exception) {
          if (exception.code == "ER_NO_REFERENCED_ROW_2") {
              var matches = exception.message.match("FOREIGN KEY (.*?) REFERENCES");
              const MessageText = `${matches[1].replace("(`", '').replace("`)", '')} is invalid`;
              return this.SendResponse(ResponseEnum.Error, MessageText);
          }
          else {
              return this.SendResponse(ResponseEnum.Error, 'Can Not Delete Purity Beacuse Its Already Used');
          }
      }
  }
}

