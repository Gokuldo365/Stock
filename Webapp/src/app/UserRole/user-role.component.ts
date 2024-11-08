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


@Component({
    selector: 'app-user-role',
    templateUrl: './user-role.component.html',
    providers: [ConfirmationService]
})

export class UserRoleComponent implements OnInit {
    UserRoleList : any = [];
    UserRoleForm : FormGroup;
    UserRoleData : UserRoleModel = new UserRoleModel;
    UserRoleId : number = 0;

    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService
    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        this.UserRoleForm = this.formbuilder.group({
            name: new FormControl("", Validators.compose([Validators.required])),
            code: new FormControl("", Validators.compose([Validators.required])),
        });
        await this.GetUserRoleList();
        this.helper.HideSpinner();
    }

    UserRoleValidationMessage = {
        name: [{ type: "required", message: "Required." }],
        code: [{ type: "required", message: "Required." }],
    };

    async GetUserRoleList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/UserRole/List");   
        this.UserRoleList = res;
        this.helper.HideSpinner();
    }

    async EditUserRole(user_role_id : number)
    {
        this.helper.ShowSpinner();
        this.UserRoleId = user_role_id;
        const res = await this.service.GetById(this.UserRoleId,'v1/UserRole/ById');  
        this.UserRoleData = res;
        this.helper.HideSpinner();
    }

    async SaveOrUpdate() {
        if (this.UserRoleForm.valid) {
            this.helper.ShowSpinner();
            let res: any;
            if (this.UserRoleData.id) {
                res = await this.service.CommonPut(this.UserRoleData, `v1/UserRole/Update/${this.UserRoleData.id}`); 
            } else {
                res = await this.service.CommonPost(this.UserRoleData, "v1/UserRole/Insert");   
            }
            if (res.Type == "S") {
                this.helper.SucessToastr(res.Message);
                await this.Cancel();
                await this.helper.redirectTo("UserRole");
                await this.GetUserRoleList();
            } else {

                this.helper.ErrorToastr(res.Message);
            }
            this.helper.HideSpinner();
        }
        else {
            this.helper.validateAllFormFields(this.UserRoleForm)
            this.helper.HideSpinner();
        }
    }

    async Delete(id: number, name: string) {
        this.confirmationService.confirm({
          message: 'Are you sure, that you want to delete - ' + name + '?',
          icon: 'pi pi-question-circle',
          accept: async () => {
            this.helper.ShowSpinner();
            let res = await this.service.Delete(`v1/UserRole/Delete/${id}`);  
            if (res.Type == "S") {
              this.helper.SucessToastr(res.Message);
              await this.GetUserRoleList();
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
        this.UserRoleId = 0;
        this.UserRoleData = new UserRoleModel();
        this.helper.HideSpinner();
    }

}

const routes: Routes = [
    { path: "", component: UserRoleComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoleRoutingModule { }

@NgModule({
    declarations: [UserRoleComponent],
    imports: [
        CommonModule,
        UserRoleRoutingModule,
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
export class UserRoleModule { }
