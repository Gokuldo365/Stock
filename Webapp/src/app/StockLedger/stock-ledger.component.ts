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
    selector: 'app-,stock-ledger',
    templateUrl: './stock-ledger.component.html',
    providers: [ConfirmationService]
})

export class StockLedgerComponent implements OnInit {
    CategoryDropdown : any = [];
    MetalDropdown : any = [];
    PurityDropdown : any = [];
    item_name_code : any = [];
    SearchData : any = {};
    StockLedgerList : any = [];
    ProductDropdown : any = [];
    ProductCombinationDropdown : any = [];
    FilterForm : FormGroup;

    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService

    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        this.FilterForm = this.formbuilder.group({
            metal_id: new FormControl('', Validators.compose([Validators.required])),
            purity_id: new FormControl('', Validators.compose([Validators.required])),
            category_id: new FormControl('', Validators.compose([Validators.required])),
            product_id: new FormControl('', Validators.compose([Validators.required])),
            combination_id: new FormControl('', Validators.compose([Validators.nullValidator])),
        });
        await this.GetMetalList();
        await this.GetStockLedgerList('');
        // await this.GetStockLedgerList()
        this.helper.HideSpinner();
    }

    FilterValidationMessage = {
        'category_id': [{ type: 'required', message: 'Required.' },],
        'metal_id': [{ type: 'required', message: 'Required.' },],
        'purity_id': [{ type: 'required', message: 'Required.' },],
        'product_id': [{ type: 'required', message: 'Required.' },],
    }

    async GetMetalList()
    {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/Metal/List");
        if(res?.length > 0)
        {
            this.MetalDropdown = res;
        }
        else
        {
            this.MetalDropdown = [];
        }
        this.helper.HideSpinner();
    }

    async GetPurityList($event)
    {
        this.helper.ShowSpinner();
        let metal_id = $event;
        let res = await this.service.GetAll("v1/Purity/List");
        if(res?.length > 0)
        {
            this.PurityDropdown = res.filter(o=> o.metal_id == metal_id);
            await this.GetCategoryList(metal_id)
        }
        else
        {
            this.PurityDropdown = [];
        }
        this.helper.HideSpinner();
    }

    async GetCategoryList(metal_id : string)
    {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll('v1/Category/GetAllCatagoryList');
        if(res?.length > 0)
        {
            this.CategoryDropdown = res.filter(o=> o.metal_id == metal_id);
            await this.GetProductList(metal_id);
        }
        else
        {
            this.CategoryDropdown = [];
        }
        this.helper.HideSpinner();
    }

    async GetProductList($event)
    {
        this.helper.ShowSpinner();
        const category_id = $event;
        let res = await this.service.GetAll('v1/Product/List');
        if(res?.length > 0)
        {
            this.ProductDropdown = res.filter(o=> o.category_id == category_id);
        }
        else
        {
            this.ProductDropdown = [];
        }
        this.helper.HideSpinner();
    }

    async GetProductCombinationList($event)
    {
        this.helper.ShowSpinner();
        const product_id = $event;
        let res = await this.service.GetById(product_id,'v1/ProductVariants/ProductVariantsListBy');
        if(res?.length > 0)
        {
            this.ProductCombinationDropdown = res;
            this.ProductCombinationValidation();
        }
        else
        {
            this.ProductCombinationDropdown = [];
        }
        this.helper.HideSpinner();
    }

    ProductCombinationValidation()
    {
        const CombinationValidation = this.FilterForm.get('combination_id');
        CombinationValidation.setErrors([Validators.required]);
        CombinationValidation.updateValueAndValidity();
    }

    async GetStockLedgerList(value: string)
    {
            // this.helper.ShowSpinner();
            // if (value === "ML") {
            //     if (this.SearchData.metal_id) {
            //         this.SearchData.metal_id = this.SearchData.metal_id;
            //     } else {
            //         delete this.SearchData.metal_id;
            //     }
            // }
            // if (value === "PT") {
            //     if (this.SearchData.purity_id) {
            //         this.SearchData.purity_id = this.SearchData.purity_id;
            //     } else {
            //         delete this.SearchData.purity_id;
            //     }
            // }
            // if (value === "CT") {
            //     if (this.SearchData.category_id) {
            //         this.SearchData.category_id = this.SearchData.category_id;
            //     } else {
            //         delete this.SearchData.category_id;
            //     }
            // }
            if (value === "PR") {
                if (this.SearchData.product_id) {
                    this.SearchData.product_id = this.SearchData.product_id;
                    let res = await this.service.CommonPost(this.SearchData,'v1/StockReport/ItemLedgerFilterList');
                    if(res?.length > 0)         
                    {
                        this.StockLedgerList = res;
                    }
                    else
                    {
                        this.StockLedgerList = [];
                    }
                    // this.helper.HideSpinner();
                } else {
                    delete this.SearchData.product_id;
                }
            }
            if (value === "PV") {
                if (this.SearchData.product_id) {
                    this.SearchData.product_id = this.SearchData.product_id;
                    let res = await this.service.CommonPost(this.SearchData,'v1/StockReport/ItemLedgerFilterList');
                    if(res?.length > 0)         
                    {
                        this.StockLedgerList = res;
                    }
                    else
                    {
                        this.StockLedgerList = [];
                    }
                    // this.helper.HideSpinner();
                } else {
                    delete this.SearchData.product_id;
                }
            }
           
        }
      
    

    
    async DownloadExcel()
    {
        let res = await this.service.DownloadPost(this.SearchData, 'v1/StockReport/ItemLedgerListDownload');
        this.helper.ExceldownloadAsBlob(res, false);
        this.helper.SucessToastr("Downloaded Successfully");
    }

    CalculateStockIn(){
        const total = this.StockLedgerList?.reduce((total, item) => {
            return total + (item.stock_in  - 0);
        }, 0);
        return total.toFixed(3);
    }

    CalculateStockOut(){
        const total = this.StockLedgerList?.reduce((total, item) => {
            return total + (item.stock_out  - 0);
        }, 0);
        return total.toFixed(3);
    }

    CalculateStockBalance(){
        const total = this.StockLedgerList?.reduce((total, item) => {
            return total + (item.stock_in  - item.stock_out);
        }, 0);
        return total.toFixed(3);
    }

    CalculateQualityIn(){
        const total = this.StockLedgerList?.reduce((total, item) => {
            return total + (item.qty_in  - 0);
        }, 0);
        return total.toFixed(0);
    }

    CalculateQualityOut(){
        const total = this.StockLedgerList?.reduce((total, item) => {
            return total + (item.qty_out  - 0);
        }, 0);
        return total.toFixed(0);
    }

    
    CalculateQtyBalance(){
        const total = this.StockLedgerList?.reduce((total, item) => {
            return total + (item.qty_in  - item.qty_out);
        }, 0);
        return total.toFixed(0);
    }
    
    CalculateFineWtyIn(){
        const total = this.StockLedgerList?.reduce((total, item) => {
            return total + (item.fine_weight_in  - 0);
        }, 0);
        return total.toFixed(3);
    }
    
    CalculateFineWtyOut(){
        const total = this.StockLedgerList?.reduce((total, item) => {
            return total + (item.fine_weight_out  - 0);
        }, 0);
        return total.toFixed(3);
    }
    
    CalculateFineWtyBalance(){
        const total = this.StockLedgerList?.reduce((total, item) => {
            return total + (item.fine_weight_in  - item.fine_weight_out);
        }, 0);
        return total.toFixed(3);
    }
   

}

const routes: Routes = [
    { path: "", component: StockLedgerComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StockLedgerRoutingModule { }

@NgModule({
    declarations: [StockLedgerComponent],
    imports: [
        CommonModule,
        StockLedgerRoutingModule,
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
export class StockLedgerModule { }
