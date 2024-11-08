import { Component, OnInit, NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModuleData } from 'src/Helper/Modules';
import { CommonHelper } from 'src/Helper/CommonHelper';
import { CommonService } from 'src/Service/Common.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { EditorModule } from 'primeng/editor';
import { StickyPageHeaderComponent } from 'src/app/Shared/sticky-page-header/sticky-page-header.component';
import { MTemplateDirective } from 'src/Directives/template.directive';
import { ProductVariantDetailModel, ProductVariantModel } from 'src/Model/ProductVariant.model';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-product-variant',
    templateUrl: './product-variant.component.html',
    providers: [ConfirmationService]

})

export class ProductVariantComponent implements OnInit {
    ProductVariantId: any;
    ProductVariantData: ProductVariantModel = new ProductVariantModel();
    ProductVariantForm: FormGroup;
    headerPinned: boolean = false;
    VariantDetailList : any = [];
    VariantDetailId : number = 0;
    VariantDetailData : ProductVariantDetailModel = new ProductVariantDetailModel();
    VariantDetailForm : FormGroup;
    VariantDetailDialouge : boolean = false;

    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService,

    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        this.ProductVariantId = this.route.snapshot.params["variant_id"];
        this.ProductVariantForm = this.formbuilder.group({
            name: new FormControl('', Validators.compose([Validators.required])),
        });
        await this.GetVariantById();
        this.helper.HideSpinner();
    }

    VariantDetailFormValidation()
    {
        this.VariantDetailForm = this.formbuilder.group({
            name: new FormControl('', Validators.compose([Validators.required])),
        });
    }

    ProductVariantValidationMessages = {
        'name': [{ type: 'required', message: 'Required.' },],
    };

    VariantDetailValidationMessages = {
        'name': [{ type: 'required', message: 'Required.' },],
    };

    async GetVariantById() {
        this.helper.ShowSpinner();
        if (this.ProductVariantId != 0) {
            this.ProductVariantData = await this.service.GetById(this.ProductVariantId, "v1/ProductVariant/ById");    
            await this.GetVariantDetailList();
        }
        else {
            this.ProductVariantData = new ProductVariantModel();
        }
        this.helper.HideSpinner();
    }

    async SaveOrUpdateBranch() {
        if (this.ProductVariantForm.valid) {
            this.helper.ShowSpinner();
            let res: any;
            if (this.ProductVariantId == 0) {
                res = await this.service.CommonPost(this.ProductVariantData, 'v1/ProductVariant/Insert');     
            }
            else {
                // SaveData.id = this.BranchId;
                res = await this.service.CommonPut(this.ProductVariantData,  `v1/ProductVariant/Update/${this.ProductVariantData.id}`) ;   
            }
            if (res.Type == "S") {
                this.helper.HideSpinner();
                this.helper.SucessToastr(res.Message);
                this.helper.redirectTo("/ProductVariant/" + (res.AddtionalData ?? this.ProductVariantData.id));
            }
            else {
                this.helper.HideSpinner();
                this.helper.ErrorToastr(res.Message);
            }
        }
        else {
            this.helper.validateAllFormFields(this.ProductVariantForm);
        }
    }

    Cancel() {
        this.ProductVariantData = new ProductVariantModel();
        this.helper.redirectTo("ProductVariantList")
    }

    async GetVariantDetailList()
    {
        this.helper.ShowSpinner();
        const res = await this.service.GetAll(`v1/ProductVariantDetail/ByProductVariantId/${this.ProductVariantId}`);      
        this.VariantDetailList = res;
        this.helper.HideSpinner();
    }

    async AddOrEditVariantDetail(id : number)
    {
        this.helper.ShowSpinner();
        this.VariantDetailFormValidation();
        this.VariantDetailId = id;
        if(this.VariantDetailId != 0)
        {
            const res = await this.service.GetById(this.VariantDetailId,'v1/ProductVariantDetail/ById');  
            this.VariantDetailData = res;
        }
        else
        {
            this.VariantDetailData =  new ProductVariantDetailModel();
        }
        this.VariantDetailDialouge = true;
        this.helper.HideSpinner();
    }

    async SaveOrUpdateVariantDetail()
    {
        if(this.VariantDetailForm.valid)
        {
            this.helper.ShowSpinner();
            let res : any;
            this.VariantDetailData.product_variant_id = this.ProductVariantId;
            if(this.VariantDetailId == 0)
            {
                res = await this.service.CommonPost(this.VariantDetailData,'v1/ProductVariantDetail/Insert');  
            }
            else
            {
                res = await this.service.CommonPut(this.VariantDetailData, `v1/ProductVariantDetail/Update/${this.VariantDetailData.id}`);  
            }
            if(res.Type == "S")
            {
                this.helper.HideSpinner();
                this.helper.SucessToastr(res.Message);
                this.VariantDetailDialouge = false;
                await this.GetVariantDetailList();
            }
            else
            {
                this.helper.HideSpinner();
                this.helper.ErrorToastr(res.Message);
            }
        }
        else
        {
            this.helper.validateAllFormFields(this.VariantDetailForm);
        }
    }

        async DeleteVariantDetail(id: number, name: string) {
            this.confirmationService.confirm({
              message: 'Are you sure, that you want to delete - ' + name + '?',
              icon: 'pi pi-question-circle',
              accept: async () => {
                this.helper.ShowSpinner();
                let res = await this.service.Delete(`v1/ProductVariantDetail/Delete/${id}`);    
                if (res.Type == "S") {
                  this.helper.SucessToastr(res.Message);
                  await this.GetVariantDetailList();
                }
                else {
                  this.helper.ErrorToastr(res.Message);
                }
                this.helper.HideSpinner();
              }
            });
          }

    ClosePopup(){
        this.VariantDetailDialouge = false;
    }

}

const routes: Routes = [
    { path: "", component: ProductVariantComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductVariantRoutingModule { }

@NgModule({
    declarations: [ProductVariantComponent],
    imports: [
        CommonModule,
        ProductVariantRoutingModule,
        ModuleData,
        DropdownModule,
        TableModule,
        ButtonModule,
        PasswordModule,
        CardModule,
        InputTextModule,
        DividerModule,
        FloatLabelModule,
        EditorModule,
        StickyPageHeaderComponent,
        MTemplateDirective,
        DialogModule,
        ConfirmDialogModule
    ],
})
export class ProductVariantModule { }
