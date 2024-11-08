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
import { StickyPageHeaderComponent } from "src/app/Shared/sticky-page-header/sticky-page-header.component";
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputNumberModule } from 'primeng/inputnumber';
import { EmployeeModel } from 'src/Model/Employee.model';
import { DropdownModule } from "primeng/dropdown";
import { id } from 'date-fns/locale';


@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    providers: [ConfirmationService]
})

export class EmployeeComponent implements OnInit {
    EmployeeList: any = [];
    UserRoleList: any = [];
    EmployeeData: EmployeeModel = new EmployeeModel;
    EmployeeForm: FormGroup;
    EmployeeId: number = 0;
    passwordFieldType: string = 'password';
    confirmPasswordFieldType: string = 'password';

    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService

    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        this.EmployeeId = this.route.snapshot.params["Employee_id"];
        this.FormValidation();
        await this.GetEmployeeList();
        await this.GetUserRoleList();
        // await this.EditEmployee(this.EmployeeId);
        this.helper.HideSpinner();
    }

    FormValidation()
    {
        this.EmployeeForm = this.formbuilder.group({
            first_name: new FormControl("", Validators.compose([Validators.required])),
            last_name: new FormControl("", Validators.compose([Validators.required])),
            mobile_number: new FormControl("", Validators.compose([Validators.required])),
            email: new FormControl("", Validators.compose([Validators.required,Validators.email])),
            user_role_id: new FormControl("", Validators.compose([Validators.required])),
            password: new FormControl('', Validators.compose([Validators.required])),
            confirm_password: new FormControl('', Validators.compose([Validators.nullValidator])),
            display_order: new FormControl(""),
        });
    }

    EmployeeValidationMessage = {
        first_name: [{ type: "required", message: "Required." }],
        last_name: [{ type: "required", message: "Required." }],
        mobile_number: [{ type: "required", message: "Required." }],
        email: [{ type: "required", message: "Required." }],
        user_role_id: [{ type: "required", message: "Required." }],
        password: [{ type: 'required', message: 'Required.' },],
        confirm_password: [{ type: 'required', message: 'Required.' },],
        display_order: [{ type: "required", message: "Please enter display order." }],
    };

     async GetUserRoleList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/UserRole/List");    
        if (res) {
            this.UserRoleList = res;
        } else {
            this.UserRoleList = [];
        }
        this.helper.HideSpinner();
    }

    async GetEmployeeList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/Employee/List");     
        if (res) {
            this.EmployeeList = res;
        }
        else
        {
            this.EmployeeList = [];
        }
        this.helper.HideSpinner();
    }

    async EditEmployee(id: number) {
        this.helper.ShowSpinner();
        let res = await this.service.GetById(id, "v1/Employee/ById");
        this.EmployeeData = res;
        this.EmployeeForm.get('display_order').addValidators(Validators.required);
        this.helper.HideSpinner();
    }

    // async SaveOrUpdate() {
    //     if (this.EmployeeForm.valid) {
    //         this.helper.ShowSpinner();
    //         let res: any;
    //         if (this.EmployeeData.id) {
    //             res = await this.service.CommonPut(this.EmployeeData, `v1/Employee/Update/${this.EmployeeData.id}`);  
    //         } else {
    //             res = await this.service.CommonPost(this.EmployeeData, "v1/Employee/Insert"); 
    //         }
    //         if (res.Type == "S") {
    //             this.helper.SucessToastr(res.Message);
    //             this.helper.redirectTo("/Employee");
    //             this.FormValidation();
    //             await this.GetEmployeeList();
    //             this.Cancel();
    //         } else {

    //             this.helper.ErrorToastr(res.Message);
    //         }
    //         this.helper.HideSpinner();
    //     }
    //     else {
    //         this.helper.validateAllFormFields(this.EmployeeForm)
    //         this.helper.HideSpinner();
    //     }
    // }


    async SaveOrUpdate() {
        if (this.EmployeeForm.valid) {
            this.helper.ShowSpinner();
            let res: any;
    
            const { confirm_password, ...EmployeeData } = this.EmployeeForm.value;
                
            if (EmployeeData.password === confirm_password) {
                if (this.EmployeeData.id != 0) {
                    res = await this.service.CommonPut(this.EmployeeData, `v1/Employee/Update/${this.EmployeeData.id}`);
                } else {
                    // this.EmployeeData.id = this.EmployeeId;
                    res = await this.service.CommonPost(this.EmployeeData, "v1/Employee/Insert");
                }
    
                if (res.Type == "S") {
                    this.helper.HideSpinner();
                    this.helper.SucessToastr(res.Message);
                    await this.helper.redirectTo("/Employee");
                    this.FormValidation();                
                    await this.GetEmployeeList();
                    this.Cancel();
                } else {
                    this.helper.HideSpinner();
                    this.helper.ErrorToastr(res.Message);
                }
            } else {
                this.helper.ErrorToastr("Password and confirm password should be the same.");
                this.helper.HideSpinner();
            }
        } else {
            this.helper.validateAllFormFields(this.EmployeeForm);
            this.helper.HideSpinner();
        }
    }






    async Delete(id: number, first_name: string) {
        this.confirmationService.confirm({
          message: 'Are you sure, that you want to delete this Employee - ' + first_name + '?',
          icon: 'pi pi-question-circle',
          accept: async () => {
            this.helper.ShowSpinner();
            let res = await this.service.Delete(`v1/Employee/Delete/${id}`);   
            if (res.Type == "S") {
              this.helper.SucessToastr(res.Message);
              this.GetEmployeeList();
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
        this.EmployeeId = 0;
        this.EmployeeData = new EmployeeModel();
        this.helper.redirectTo("Employee");
        this.helper.HideSpinner();
    }

    togglePasswordVisibility(): void {
        this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    }

    toggleConfirmPasswordVisibility(): void {
        this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    }

    CheckConfirmPassword(password : any , confirm_password : any)
    {

        if(password != confirm_password)
        {
            const ConfimPasswordValidation = this.EmployeeForm.get('confirm_password');
            
        }
    }

   

}

const routes: Routes = [
    { path: "", component: EmployeeComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeRoutingModule { }

@NgModule({
    declarations: [EmployeeComponent],
    imports: [
        CommonModule,
        EmployeeRoutingModule,
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
        KeyFilterModule,
        ConfirmDialogModule,
        InputNumberModule,
        DropdownModule
    ],
})
export class EmployeeModule { }
