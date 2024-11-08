import { Component, OnInit, NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModuleData } from 'src/Helper/Modules';
import { CommonHelper } from 'src/Helper/CommonHelper';
import { CommonService } from 'src/Service/Common.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { CalendarModule } from 'primeng/calendar';
import { StickyPageHeaderComponent } from "src/app/Shared/sticky-page-header/sticky-page-header.component";
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { MTemplateDirective } from 'src/Directives/template.directive';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StockFormComponent } from '../stock-form/stock-form.component';
import { StockProductFormComponent } from '../../stock-product-form/stock-product-form.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
    selector: 'app-stock-inward-form',
    templateUrl: './stock-inward-form.component.html',
    providers: [ConfirmationService]
})

export class StockInWardFormComponent implements OnInit {
    headerPinned : boolean = false;
    InwardProductList : any = [];
    InwardProductDetailList : any = [];
    InwardProductDialouge : boolean = false;
    metalList : any[] = [];
    purityList: any[] = [];
    CategoryDropdown : any = [];
    SubCategoryDropdown : any = [];    
    InwardEntryData : any = [];
    InwardSearchData : any = {};
    inwardForm : FormGroup = this.formbuilder.group({
        id: [''],
        stock_number: [{value: 'AUTO NUMBER', disabled: true}],
        status: [''],
        stock_entry_type: ['Inward'],        
        stock_entry_date_time: [new Date(), Validators.required],
        hand_over_id: ['', Validators.required],
        received_by_id: ['', Validators.required],
        metal_id: ['', Validators.required],
        purity_id: ['', Validators.required],        
        note: [''],
    }, { validator: this.handOverAndIssueValidation });
    InwardId : number = 0;
    InwardInfoId : any = "";
    employeeList: any[] = [];
    today: Date = new Date();
    stockProductList: any[] = [];
    stockProductTotalWeightDetail: any;
    purityListByMetal: any[] = [];
    inWardInfo: any = {};
    get inwardFC() {
        return this.inwardForm.controls;
    }
    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private confirmationService: ConfirmationService,
        public dialogService: DialogService
    ) { }
    

    async ngOnInit() {
        this.helper.ShowSpinner();
        this.InwardInfoId = this.route.snapshot.params["inward_id"];
        this.InwardInfoId != 0 && await this.getInwardInfo();
        this.InwardInfoId != 0 && await this.getStockProductList();
        await this.getMetalList();
        await this.getPurityList();
        await this.getEmployeeList();        
        this.helper.HideSpinner();        
    }

    InwardInfoValidationMessage = {
        'stock_entry_date_time': [{ type: 'required', message: 'Required.' },],
        'received_by': [{ type: 'required', message: 'Required.' },],
        'issued_by': [{ type: 'required', message: 'Required.' },],
        'note': [{ type: 'required', message: 'Required.' },],
    }

    async getInwardInfo() {
        this.helper.ShowSpinner();
        const res = await this.service.GetAll(`v1/StockEntry/StockEntry/${this.InwardInfoId}`); 
        this.inWardInfo = res;
        this.inwardForm.patchValue(res);        
        this.helper.HideSpinner();
    }

    async getMetalList() {
        this.helper.ShowSpinner();
        const res = await this.service.GetAll('v1/Metal/List');
        if(res?.length > 0) {
            this.metalList = res;
            await this.getPurityList();
            if( this.InwardInfoId != 0) {
                await this.metalChange({value: this.inwardFC.metal_id.value});
                this.inwardForm.patchValue(this.inWardInfo);
            }
        }
        this.helper.HideSpinner();
    }

    async getPurityList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/Purity/List");     
        if (res) {
            this.purityList = res;
        }       
        this.helper.HideSpinner();
    }

    async GetCategoryListEvent($event) {
        this.helper.ShowSpinner();
        const res = await this.service.GetAll('v1/Category/List');
        if(res?.length > 0)
        {
            this.CategoryDropdown = res.filter(o=> o.metal_id == $event);
        }
        else
        {
            this.CategoryDropdown = [];
        }
        this.helper.HideSpinner();
    }

    async GetSubCategoryListEvent($event) {
        this.helper.ShowSpinner();
        const res = await this.service.GetAll('v1/SubCategory/List');
        if(res?.length > 0) {
            this.SubCategoryDropdown = res.filter(o=> o.category_id == $event);
        }
        else
        {
            this.SubCategoryDropdown = [];
        }
        this.helper.HideSpinner();
    }

    async AddInwardProduct() {
        this.helper.ShowSpinner();
        await this.getMetalList();
        this.InwardProductList = [];
        this.InwardSearchData = {};
        this.InwardProductDialouge = true;
        this.helper.HideSpinner();
    }

    async GetFilteredProduct()
    {
        this.helper.ShowSpinner();
        let res = await this.service.CommonPost(this.InwardSearchData,'v1/StockEntryDetail/ProductListFilter');
        if(res?.length > 0)
        {
            this.InwardProductList = res;
        }
        else
        {
            this.InwardProductList = [];
        }
        this.helper.HideSpinner();
    }

    async InsertInwardInfo() {
        if(this.inwardForm.invalid) {
            this.inwardForm.markAllAsTouched();
            return;
        }
        this.helper.ShowSpinner();
        let res : any;
        if(this.InwardInfoId == '0')
        {
            res = await this.service.CommonPost(this.inwardForm.value,'v1/StockEntry/Insert');
        }
        else
        {
            res = await this.service.CommonPut(this.inwardForm.value,`v1/StockEntry/Update/${this.InwardInfoId}`);
        }
        if(res.Type == "S") {            
            this.helper.SucessToastr(res.Message);
            if( res?.AddtionalData) {
                this.InwardInfoId = res.AddtionalData;
                this.router.navigateByUrl(`/`, {skipLocationChange: true}).then(
                    ()=>this.router.navigate([`/StockInward/${res.AddtionalData}`])
                );                
            }                
        } else {           
            this.helper.ErrorToastr(res.Message);
        }
        this.helper.HideSpinner();       
    }

    async GetInwardProductDetailList() {
        this.helper.ShowSpinner();
        const res = await this.service.GetAll(`v1/StockEntryDetail/List/${this.InwardInfoId}`);
        if(res?.length > 0) {
            this.InwardProductDetailList = res;
        }
        else {
            this.InwardProductDetailList = [];
        }
        this.helper.HideSpinner();
    }

    async InsertProductInward() {
        let Product = this.InwardProductList.filter(o=> o.Individual_product_stock > 0);
        let AttributeProduct = this.InwardProductList.filter(o=> o.combination_stock > 0);
        
        if(Product?.length == 0 && AttributeProduct?.length == 0)
        {
            this.helper.ErrorToastr('Please provide quantity for atleast one product');
        }
        else
        {
            this.helper.ShowSpinner();
            let SaveData : any = {};
            let res : any;
            SaveData.stock_entry_type = "Inward";
            SaveData.stock_entry_id = this.InwardInfoId;
            SaveData.individual_product = [];
            SaveData.attribute_product_list = [];

            if(Product?.length > 0)
            {
                for (let item of Product)
                {
                    SaveData.individual_product.push({
                        product_id: item.product_id,
                        individual_product_stock:  Number(item.Individual_product_stock)  
                    })
                }
            }
            if(AttributeProduct?.length > 0)
            {
                for (let Obj of AttributeProduct)
                {
                    SaveData.attribute_product_list.push({
                        product_id:Obj.product_id,
                        id: Obj.combination_id,
                        value: Obj.combination_value,
                        stock:Number(Obj.combination_stock)
                    })

                }
            }
            res = await this.service.CommonPost(SaveData,'v1/StockEntryDetail/Insert');
            if(res.Type == "S")
            {
                this.helper.HideSpinner();
                this.helper.SucessToastr(res.Message);
                this.InwardProductDialouge = false;
                await this.GetInwardProductDetailList();
            }
            else
            {
                this.helper.HideSpinner();
                this.helper.ErrorToastr(res.Message);
            }

        }
    }

    async openStockForm(type: 'Inward'| 'Outward', isEdit: boolean, product: any) {
        const stockProducts  = this.stockProductList.reduce((acc, pro)=>{
            (isEdit && product.product_id === pro.product_id) || acc.productIds.push(pro.product_id);
            (isEdit && product.product_variants_id === pro.product_variants_id) || acc.variantIds.push(pro.product_variants_id);            
            return acc;
        }, {productIds: [], variantIds: []});
        const ref: DynamicDialogRef = this.dialogService.open(StockProductFormComponent, { 
            data: {stockType: type, isEdit: isEdit,  stockInfo: this.inwardForm.value, product: product, stockProducts: stockProducts},
            header: isEdit ? `Edit ${product.product_name} stock` : 'Add Product',
            breakpoints: {
                '1400px': '70vw',
                '1200px': '75vw',
                '992px': '80vw',
                '768px': '90vw',
                '576px': '100vw'
            },
        });
        ref.onClose.subscribe((data: boolean) => {
            data && this.getStockProductList();
        });
    }

    async getEmployeeList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/Employee/List");     
        if (res) {
            this.employeeList = res;
        }
        else {
            this.employeeList = [];
        }
        this.helper.HideSpinner();
    }

    handOverAndIssueValidation(group: AbstractControl): { [key: string]: any } | null {
        const handOverBy = group.get('hand_over_id');
        const issuedBy = group.get('received_by_id');
        if(handOverBy.hasError('required') || issuedBy.hasError('required') ) {
            return null
        }
        if (handOverBy.value === issuedBy.value) {
            issuedBy.setErrors({sameEmployee: true});
            handOverBy.setErrors({sameEmployee: true});
            return null; 
        } 
        issuedBy.setErrors(null);
        handOverBy.setErrors(null);
        return null;
        
    }

    async getStockProductList() {
        const res = await this.service.GetById(this.inwardForm.value.id,'v1/StockEntryDetail/StockEntryDetailList');        
        this.stockProductList = res;
        this.stockProductTotalWeightDetail = this.stockProductList.reduce((acc, product)=>{
            return {
                qty: +product.stock_qty + acc.qty,
                netWt: +product.net_weight + acc.netWt,
                otherWt: +product.other_weight + acc.otherWt,
                grossWt: +product.gross_weight + acc.grossWt
            }
        }, {qty: 0, netWt: 0, otherWt: 0, grossWt: 0});
    }

    async deleteStock(id: number) {
        this.helper.ShowSpinner();
        const res = await this.service.Delete(`v1/StockEntryDetail/Delete/${id}`);
        if(res.Type == "S") {            
            this.helper.SucessToastr(res.Message);
            this.getStockProductList();          
        } else {
            this.helper.ErrorToastr(res.Message);
        }
        this.helper.HideSpinner();        
    }

    parseString(string: string) {        
        return typeof string === 'string' ?  JSON.parse(string) : '';        
    }

    async deleteConfirmation(product) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `Are you sure that you want to delete "${product.product_name} - ${product.combination}"?`,
            header: 'Delete Permanently',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon:"none",
            rejectIcon:"none",
            rejectButtonStyleClass:"p-button-text",
            accept: () => {
                this.deleteStock(product.id);
            }
        });
    }

    metalChange(eve: DropdownChangeEvent | any) {
        console.log(eve)
        const metalId = eve.value;
        this.inwardForm.get('purity_id').setValue('');
        this.purityListByMetal = this.purityList.filter(purity => purity.metal_id == metalId)
    }
}

const routes: Routes = [
    { path: "", component: StockInWardFormComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StockInWardFormRoutingModule { }

@NgModule({
    declarations: [StockInWardFormComponent],
    imports: [
        CommonModule,
        StockInWardFormRoutingModule,
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
        CalendarModule,
        DropdownModule,
        DialogModule,
        MTemplateDirective,
        OverlayPanelModule,
    ],
    providers: [
        DialogService,
        ConfirmationService
    ],
})
export class StockInWardFormModule { }
