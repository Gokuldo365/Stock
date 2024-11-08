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
import { CustomerModel } from 'src/Model/Customer.model';
import { StickyPageHeaderComponent } from "src/app/Shared/sticky-page-header/sticky-page-header.component";
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { KeyFilterModule } from 'primeng/keyfilter';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-,customer',
    templateUrl: './customer.component.html',
    providers: [ConfirmationService]
})

export class CustomerComponent implements OnInit {
    CustomerList: any = [];
    CustomerData: CustomerModel = new CustomerModel();
    CustomerForm: FormGroup;
    CustomerId: number = 0;
    BusinessCategoryList : any = [];

    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService

    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        this.CustomerId = this.route.snapshot.params["Customer_id"];
        this.FormValidation();
        await this.GetBusinessCategoryList();
        await this.GetCustomerList();
        this.helper.HideSpinner();
    }

    FormValidation()
    {
        this.CustomerForm = this.formbuilder.group({
            business_category_id: new FormControl("", Validators.compose([Validators.required])),
            business_name: new FormControl("", Validators.compose([Validators.required])),
            email: new FormControl('', Validators.compose([Validators.nullValidator, Validators.pattern("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"), Validators.pattern("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$")])),
            mobile_no: new FormControl("", Validators.compose([Validators.nullValidator])),
            address: new FormControl("", Validators.compose([Validators.required])),
            display_order: new FormControl(""),
        });
    }

    CustomerValidationMessage = {
        business_category_id: [{ type: "required", message: "Required." }],
        business_name: [{ type: "required", message: "Required." }],
        address: [{ type: "required", message: "Required." }],
        display_order: [{ type: "required", message: "Please enter display order." }],
    };

    async GetBusinessCategoryList()
    {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll('v1/BusinessCategory/List');
        if(res?.length > 0)
        {
            this.BusinessCategoryList = res;
        }
        else
        {
            this.BusinessCategoryList = [];
        }
        this.helper.HideSpinner();
    }

    async GetCustomerList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/Business/List");     
        if(res)
        {
            this.CustomerList = res;
        }
        else
        {
            this.CustomerList = [];
        }
        this.helper.HideSpinner();
    }

    async EditCustomer(id: number) {
        this.helper.ShowSpinner();
        let res = await this.service.GetById(id,`v1/Business/ById`);
        this.CustomerData = res;
        this.CustomerForm.get('display_order').addValidators(Validators.required);
        this.helper.HideSpinner();
    }

    async SaveOrUpdate() {
        if (this.CustomerForm.valid) {
            this.helper.ShowSpinner();
            let res: any;
            if (this.CustomerData.id) {
                res = await this.service.CommonPut(this.CustomerData, `v1/Business/Update/${this.CustomerData.id}`);   
            } else {
                res = await this.service.CommonPost(this.CustomerData, "v1/Business/Insert"); 
            }
            if (res.Type == "S") {
                this.helper.SucessToastr(res.Message);
                this.helper.redirectTo("/Business");
                this.FormValidation();
                await this.GetCustomerList();
                this.Cancel();
            } else {

                this.helper.ErrorToastr(res.Message);
            }
            this.helper.HideSpinner();
        }
        else {
            this.helper.validateAllFormFields(this.CustomerForm)
            this.helper.HideSpinner();
        }
    }

    async Delete(id: number, business_name: string) {
        this.confirmationService.confirm({
          message: 'Are you sure, that you want to delete - ' + business_name + '?',
          icon: 'pi pi-question-circle',
          accept: async () => {
            this.helper.ShowSpinner();
            let res = await this.service.Delete(`v1/Business/Delete/${id}`);   
            if (res.Type == "S") {
              this.helper.SucessToastr(res.Message);
              this.GetCustomerList();
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
        this.CustomerId = 0;
        this.CustomerData = new CustomerModel();
        this.helper.redirectTo("/Business")
        this.helper.HideSpinner();
    }

   

}

const routes: Routes = [
    { path: "", component: CustomerComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CustomerRoutingModule { }

@NgModule({
    declarations: [CustomerComponent],
    imports: [
        CommonModule,
        CustomerRoutingModule,
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
        KeyFilterModule,
        DropdownModule
    ],
})
export class CustomerModule { }
