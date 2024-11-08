import { Component, OnInit, NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModuleData } from 'src/Helper/Modules';
import { CommonHelper } from 'src/Helper/CommonHelper';
import { CommonService } from 'src/Service/Common.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import jwt_decode from "jwt-decode";
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { UserLoginModel } from 'src/Model/UserLogin.model';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CheckboxModule } from 'primeng/checkbox';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
    `.lp {
      min-height: 100vh;
    }`,
    `.fc {
      min-width: 400px;
      background-color: var(--surface-card);
    }`,
    `.banner_img {
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      object-position: center;
    }`
  ]
})

export class LoginComponent implements OnInit {
  User: any = {};
  UserForm: FormGroup;
  LoginAuthDialog: Boolean = false;
  Userdata: any = {};
  ValidateData: UserLoginModel = new UserLoginModel();
  rememberMe: boolean = false;

  constructor(
    private helper: CommonHelper,
    private service: CommonService,
    private formbuilder: FormBuilder,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.helper.DeleteAllLocalStorage();
    this.UserForm = this.formbuilder.group({
      email: new FormControl('', Validators.compose([Validators.required])),
      password: new FormControl('', Validators.compose([Validators.required]))
    });
    if (this.helper.GetUserInfo()?.id > 0) {
      this.helper.DeleteAllLocalStorage();
    }
  }

  LoginValidationMessages = {
    'email': [{ type: 'required', message: 'Required.' }, { type: 'pattern', message: 'Invalid email' }],
    'password': [{ type: 'required', message: 'Required.' }, { type: 'minlength', message: 'At least 6 characters, but longer is better.' }],
  };

  async LoginCommonCall(data: any) {
    this.helper.ShowSpinner();
    this.helper.DeleteAllLocalStorage();
    let res = await this.service.CommonPost(data, "v1/Auth/Login");
    if (res.Type == "S") {
      let decoded: any = {};
      decoded = jwt_decode(res?.result?.api_token);
      console.log(decoded);
      this.Userdata = { ...decoded, api_token: res?.result?.api_token };
      this.helper.SucessToastr(res.Message);
      this.helper.SetLocalStorage(this.helper.StorageName, this.Userdata);
      let Data = this.helper.GetUserInfo();
      let landing_page = Data?.user_role?.landing_page;
      const CompanyData = await this.service.GetAll("v1/Company/List");
      if(CompanyData?.length > 0)
      {
        this.helper.SetLocalStorage('Company' , CompanyData[0]);
      }
      if (landing_page) {
        this.helper.redirectTo(landing_page);
      }
      else {
        this.helper.redirectTo("Dashboard");
      }
      this.helper.HideSpinner();
    }
    else {
      this.helper.HideSpinner();
      this.helper.ErrorToastr(res.Message);
    }
  }

  async Login() {
    if (this.UserForm.valid == true) {
      this.LoginCommonCall(this.User);
    }
  }

  // async Login()
  // {
  //   this.helper.redirectTo("Dashboard");
  // }

}

const routes: Routes = [
  { path: "", component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ModuleData,
    DialogModule,
    PasswordModule,
    InputTextModule,
    CardModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    FloatLabelModule,
    CheckboxModule,
    IconFieldModule,
    InputIconModule
  ],
})
export class LoginModule { }
