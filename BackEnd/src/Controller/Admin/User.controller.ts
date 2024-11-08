import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { CurrentUser } from '@Helper/Common.helper';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '@Service/Admin/User.service';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { ChangePasswordModel, UserModel } from '@Model/Admin/User.model';
import { JWTAuthController } from '@Controller/JWTAuth.controller';

@Controller({ path: "User", version: '1' })
@ApiTags("User")
export class UserController extends JWTAuthController {

  constructor(
    private _UserService: UserService,
  ) {
    super()
  }

  @Get('List')
  async List() {
    const UserListData = await this._UserService.GetAllExpectSuperAdmin();
    return this.SendResponseData(UserListData);
  }

  @Get('ById/:Id')
  async ById(@Param('Id') Id: string) {
    const UserData = await this._UserService.GetById(Id);
    return this.SendResponseData(UserData);
  }

  @Post('Insert')
  async Insert(@Body() UserData: UserModel, @CurrentUser() UserId: string) {
    const ResultData = await this._UserService.Insert(UserData, UserId);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Created, ResultData.id);
  }

  @Put('Update/:Id')
  async Update(@Param('Id') Id: string, @Body() UserData: UserModel, @CurrentUser() UserId: string) {
    await this._UserService.Update(Id, UserData, UserId);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Updated);
  }

  @Patch('SuspendOrActivate/:Id')
  async SuspendOrActivate(@Param('Id') id: string, @CurrentUser() UserId: string) {
    const UserData = await this._UserService.SuspendOrActivate(id, UserId);
    if (UserData.status == true) {
      return this.SendResponse(ResponseEnum.Success, ResponseEnum.Activated);
    }
    else {
      return this.SendResponse(ResponseEnum.Success, ResponseEnum.Suspended);
    }
  }

  @Post('ChangePassword')
  async ChangePassword(@Body() ChangePasswordData: ChangePasswordModel, @CurrentUser() UserId: string) {
    await this._UserService.ChangePassword(UserId, ChangePasswordData);
    return this.SendResponse(ResponseEnum.Success, "Password changed successfully");
  }

  @Put('ResetPassword/:Id')
  async ResetPassword(@Param('Id') Id: string, @Body() UserData: UserModel, @CurrentUser() UserId: string) {
    await this._UserService.UserResetPassword(Id, UserData, UserId);
    return this.SendResponse(ResponseEnum.Success, ResponseEnum.Reset);
  }


}

