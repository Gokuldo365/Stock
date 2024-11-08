import { Component, OnInit, NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModuleData } from 'src/Helper/Modules';
import { CommonHelper } from 'src/Helper/CommonHelper';
import { CommonService } from 'src/Service/Common.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { CurrencyModel } from 'src/Model/Currency.model';
import { StickyPageHeaderComponent } from "src/app/Shared/sticky-page-header/sticky-page-header.component";
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from "primeng/dropdown";
import { UserRoleModel } from 'src/Model/UserRole.model';
import { UserModel } from 'src/Model/User.model';


@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    providers: [ConfirmationService]
})

export class UserComponent implements OnInit {
    UserList : any = [];
    UserForm : FormGroup;
    UserData : UserModel = new UserModel();
    UserId : number = 0;
    UserRoleList : any = [];

    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService
    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        await this.UserFormValidation();
        await this.GetUserRoleList();
        await this.GetUserList();
        this.helper.HideSpinner();
    }

    UserFormValidation()
    {
        this.UserForm = this.formbuilder.group({
            user_role_id: new FormControl("", Validators.compose([Validators.required])),
            first_name: new FormControl("", Validators.compose([Validators.required])),
            last_name: new FormControl("", Validators.compose([Validators.required])),
            email: new FormControl("", Validators.compose([Validators.required])),
            mobile: new FormControl("", Validators.compose([Validators.required])),
            password: new FormControl("", Validators.compose([Validators.required])),
        });
    }

    UserValidationMessage = {
        user_role_id: [{ type: "required", message: "Required." }],
        first_name: [{ type: "required", message: "Required." }],
        last_name: [{ type: "required", message: "Required." }],
        email: [{ type: "required", message: "Required." }],
        mobile: [{ type: "required", message: "Required." }],
        password: [{ type: "required", message: "Required." }],
    };

    async GetUserRoleList()
    {
        this.helper.ShowSpinner();
        const res = await this.service.GetAll('v1/UserRole/List');
        if(res?.length > 0)
        {
            this.UserRoleList = res;
        }
        else
        {
            this.UserRoleList = [];
        }
        this.helper.HideSpinner();
    }

    async GetUserList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/User/List");   
        this.UserList = res;
        this.helper.HideSpinner();
    }

    async EditUser(user_id : number)
    {
        this.helper.ShowSpinner();
        this.UserId = user_id;
        const res = await this.service.GetById(this.UserId,'v1/User/ById');  
        this.UserData = res;
        this.helper.HideSpinner();
    }

    async SaveOrUpdate() {
        if (this.UserForm.valid) {
            this.helper.ShowSpinner();
            let res: any;
            if (this.UserData.id) {
                res = await this.service.CommonPut(this.UserData, `v1/User/Update/${this.UserData.id}`); 
            } else {
                res = await this.service.CommonPost(this.UserData, "v1/User/Insert"); 
            }
            if (res.Type == "S") {
                this.helper.SucessToastr(res.Message);
                await this.Cancel();
                await this.helper.redirectTo("User");
                this.UserFormValidation();
                await this.GetUserList();
            } else {

                this.helper.ErrorToastr(res.Message);
            }
            this.helper.HideSpinner();
        }
        else {
            this.helper.validateAllFormFields(this.UserForm)
            this.helper.HideSpinner();
        }
    }

    async Delete(id: number, name: string) {
        this.confirmationService.confirm({
          message: 'Are you sure, that you want to delete - ' + name + '?',
          icon: 'pi pi-question-circle',
          accept: async () => {
            this.helper.ShowSpinner();
            let res = await this.service.Delete(`/${id}`);
            if (res.Type == "S") {
              this.helper.SucessToastr(res.Message);
              await this.GetUserList();
            }
            else {
              this.helper.ErrorToastr(res.Message);
            }
            this.helper.HideSpinner();
          }
        });
      }

    Cancel() {
        this.helper.ShowSpinner();
        this.UserId = 0;
        this.UserData = new UserModel();
        this.helper.HideSpinner();
    }

}

const routes: Routes = [
    { path: "", component: UserComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }

@NgModule({
    declarations: [UserComponent],
    imports: [
        CommonModule,
        UserRoutingModule,
        ModuleData,
        CardModule,
        FloatLabelModule,
        InputTextModule,
        ButtonModule,
        InputTextareaModule,
        TableModule,
        IconFieldModule,
        InputIconModule,
        FormsModule,
        StickyPageHeaderComponent,
        ConfirmDialogModule,
        InputNumberModule,
        DropdownModule
    ],
})
export class UserModule { }
