import { Component, OnInit, NgModule } from "@angular/core";
import { CommonHelper } from "src/Helper/CommonHelper";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from "primeng/dynamicdialog";
import { CommonService } from "src/Service/Common.service";
import { Routes, RouterModule, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ModuleData } from "src/Helper/Modules";
import { PasswordModule } from "primeng/password";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-changepassword",
  templateUrl: "./changepassword.component.html",
})

export class ChangePasswordComponent implements OnInit {
  UserData: any = {};
  ChangePasswordForm: FormGroup;
  password: string;
  confirm_password: string;
  old_password: string;
  ChangePasswordDialog: Boolean = false;

  constructor(
    private helper: CommonHelper,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public commonservice: CommonService,
    private formbuilder: FormBuilder,
    public route: Router,
  ) { }

  ngOnInit() {
    this.ChangePasswordForm = this.formbuilder.group(
      {
        password: new FormControl("", Validators.compose([Validators.required, Validators.minLength(6)])),
        confirm_password: new FormControl("", Validators.compose([Validators.required, Validators.minLength(6)])),
        old_password: new FormControl("", Validators.compose([Validators.required, Validators.minLength(6)])),
      },
    );
  }

  ChangePasswordValidationMessages = {
    password: [
      { type: "required", message: "New Password Required." },
      { type: "minlength", message: "At least 6 characters, but longer is better." }
    ],
    confirm_password: [
      { type: "required", message: "Confirm Password Required." },
      { type: "minlength", message: "At least 6 characters, but longer is better." },
    ],
    old_password: [
      { type: "required", message: "Old Password Required." },
      { type: "minlength", message: "At least 6 characters, but longer is better." },
    ],
  };

  async ChangePassword() {
    if (this.ChangePasswordForm.valid == true) {
      this.helper.ShowSpinner();
      let userdata = {
        user_id: this.helper.GetUserInfo().id,
        password: this.confirm_password,
        old_password: this.old_password,
      };
      if (this.password == this.confirm_password) {
        let res = await this.commonservice.CommonPost(userdata, "ChangePassword");
        if (res["Type"] == "S") {
          this.helper.SucessToastr(res.Message, "User");
          this.ref.close(true);
          this.helper.DeleteAllLocalStorage();
          this.helper.redirectTo("Login");
          this.helper.HideSpinner();
        } else {
          this.helper.ErrorToastr(res.Message, "User");
          this.helper.HideSpinner();
        }
      }
      else {
        this.helper.ErrorToastr("New password and confirm password does not match");
      }
    } else {
      this.helper.validateAllFormFields(this.ChangePasswordForm);
    }
  }

  Cancel() {
    this.ref.close();
  }

}

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangePasswordRoutingModule { }

@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    CommonModule,
    ChangePasswordRoutingModule,
    ModuleData,
    PasswordModule,
    ButtonModule
  ],
  exports: [ChangePasswordComponent],
})
export class ChangePasswordModule { }
