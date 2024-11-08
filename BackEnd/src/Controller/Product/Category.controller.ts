import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { JWTAuthController } from '@Controller/JWTAuth.controller';
import { CategoryService } from '@Root/Service/Product/Category.service';
import { CategoryModel } from '@Model/Product/Category.model';

@Controller({ path: "Category", version: '1' })
@ApiTags("Category")
export class CategoryController extends JWTAuthController {

    constructor(private _CategoryService: CategoryService) {
        super()
    }

    @Get('List')
    async List() {
        const CategoryListData = await this._CategoryService.GetAll();
        return this.SendResponseData(CategoryListData);
    }

    @Get('GetAllParentCatagoryList')
    async GetAllCatagoy() {
        const CategoryListData = await this._CategoryService.GetAllCatagoy();
        return this.SendResponseData(CategoryListData);
    }

    @Get('GetAllCatagoryList')
    async GetAllCatagoyList() {
        const CategoryListData = await this._CategoryService.GetAllCatagoyList();
        return this.SendResponseData(CategoryListData);
    }

    @Get('ById/:Id')
    async ById(@Param('Id') Id: string) {
        const CategoryData = await this._CategoryService.GetById(Id);
        return this.SendResponseData(CategoryData);
    }

    @Post('Insert')
    async Insert(@Body() CategoryData: CategoryModel, @CurrentUser() UserId: string) {
        const CategoryDataId = await this._CategoryService.Insert(CategoryData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created, CategoryDataId.id);
    }

    @Put('Update/:Id')
    async Update(@Param('Id') Id: string, @Body() CategoryData: CategoryModel, @CurrentUser() UserId: string) {
        await this._CategoryService.Update(Id, CategoryData, UserId);
        return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
    }

    @Delete('Delete/:Id')
  async Delete(@Param('Id') Id: string) {
      try {
          await this._CategoryService.Delete(Id);
          return this.SendResponse(ResponseEnum.Success, ResponseEnum.Deleted);
      }
      catch (exception) {
          if (exception.code == "ER_NO_REFERENCED_ROW_2") {
              var matches = exception.message.match("FOREIGN KEY (.*?) REFERENCES");
              const MessageText = `${matches[1].replace("(`", '').replace("`)", '')} is invalid`;
              return this.SendResponse(ResponseEnum.Error, MessageText);
          }
          else {
              return this.SendResponse(ResponseEnum.Error, 'Can Not Delete Category Beacuse Its Already Used');
          }
      }
  }
}

