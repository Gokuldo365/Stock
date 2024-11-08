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

@Component({
    selector: 'app-,business-category',
    templateUrl: './business-category.component.html',
    providers: [ConfirmationService]
})

export class BusinessCategoryComponent implements OnInit {
    BusinessCategoryList : any = [];
    CategoryForm : FormGroup;
    BusinessCategoryData : any = {};
    BusinessCategoryId : number = 0;

    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService

    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        this.FormValidation();
        this.BusinessCategoryId = this.route.snapshot.params["BusinessCategory_id"];
        await this.GetBusinessCategoryList();
        this.helper.HideSpinner();
    }

    FormValidation()
    {
        this.CategoryForm = this.formbuilder.group({
            name: new FormControl("", Validators.compose([Validators.required])),
            display_order: new FormControl(""),
        });
    }

    BusinessCategoryValidationMessage = {
        name: [{ type: "required", message: "Required." }],
        display_order: [{ type: "required", message: "Please enter display order." }],
    };

    async GetBusinessCategoryList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/BusinessCategory/List");     
        if(res)
        {
            this.BusinessCategoryList = res;
        }
        else
        {
            this.BusinessCategoryList = [];
        }
        this.helper.HideSpinner();
    }

    async EditBusinessCategory(id) {
        this.helper.ShowSpinner();
        this.BusinessCategoryId = id;
        let res = await this.service.GetById(id, "v1/BusinessCategory/ById");
        this.BusinessCategoryData = res;
        this.CategoryForm.get('display_order').addValidators(Validators.required);
        this.helper.HideSpinner();
    }

    async SaveOrUpdate()
    {
        if(this.CategoryForm.valid)
        {
            this.helper.ShowSpinner();
            let res : any;

            if (this.BusinessCategoryData.id) {
                res = await this.service.CommonPut(this.BusinessCategoryData, `v1/BusinessCategory/Update/${this.BusinessCategoryData.id}`);  
            } else {
                res = await this.service.CommonPost(this.BusinessCategoryData,'v1/BusinessCategory/Insert'); 
            }
            if(res?.Type == "S")
            {
                this.helper.HideSpinner();
                this.helper.SucessToastr(res.Message);
                this.helper.redirectTo("/BusinessCategory");
                this.FormValidation();
                await this.GetBusinessCategoryList();
                this.Cancel();
            }
            else
            {
                this.helper.HideSpinner();
                this.helper.ErrorToastr(res.Message);
            }
        }
        else
        {
            this.helper.validateAllFormFields(this.CategoryForm);
        }
    }

    async Delete(id: number, name: string) {
        this.confirmationService.confirm({
          message: 'Are you sure, that you want to delete - ' + name + '?',
          icon: 'pi pi-question-circle',
          accept: async () => {
            this.helper.ShowSpinner();
            let res = await this.service.Delete(`v1/BusinessCategory/Delete/${id}`);   
            if (res.Type == "S") {
              this.helper.SucessToastr(res.Message);
              await this.GetBusinessCategoryList();
            }
            else {
              this.helper.ErrorToastr(res.Message);
            }
            this.helper.HideSpinner();
          }
        });
      }


    Cancel()
    {
        this.helper.ShowSpinner();
        this.BusinessCategoryData = {};
        this.helper.HideSpinner();
    }

   

}

const routes: Routes = [
    { path: "", component: BusinessCategoryComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BusinessCategoryRoutingModule { }

@NgModule({
    declarations: [BusinessCategoryComponent],
    imports: [
        CommonModule,
        BusinessCategoryRoutingModule,
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
        KeyFilterModule
    ],
})
export class BusinessCategoryModule { }
