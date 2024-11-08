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
import { InputNumberModule } from 'primeng/inputnumber';
import { KeyFilterModule } from 'primeng/keyfilter';
import { DropdownModule } from 'primeng/dropdown';
import { id } from 'date-fns/locale';

@Component({
    selector: 'app-business-ledger',
    templateUrl: './business-ledger.component.html',
    providers: [ConfirmationService]
})

export class BusinessLedgerComponent implements OnInit {

    SearchData : any = {};
    BusinessLedgerList : any = [];
    BusinessDropdown : any = [];
    BusinessCategoryDropdown : any = [];
    ProductCombinationDropdown : any = [];
    FilterForm : FormGroup;
    CurrencySymbol : string = "";
    MetalList : any = [];
    PurityList : any = [];

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
            business_id: new FormControl('', Validators.compose([Validators.required])),
            business_category: new FormControl('', Validators.compose([Validators.required])),
            metal_id: new FormControl('', Validators.compose([Validators.required])),
            purity_id: new FormControl('', Validators.compose([Validators.nullValidator])),
        });
        await this.GetBusinessCategoryList();
        await this.GetMetalList();
        this.CurrencySymbol = this.helper.GetDefaultCurrency();
        this.helper.HideSpinner();
    }

    FilterValidationMessage = {
        'business_id': [{ type: 'required', message: 'Required.' },],
        'business_category': [{ type: 'required', message: 'Required.' },],
        'metal_id': [{ type: 'required', message: 'Required.' },],
    }

    async GetMetalList()
    {
        this.helper.ShowSpinner();
        const res = await this.service.GetAll('v1/Metal/List');
        if(res?.length > 0)
        {
            this.MetalList = res;
        }
        else
        {
            this.MetalList = [];
        }
        this.helper.HideSpinner();
    }

    async GetPurityList($event)
    {
        this.helper.ShowSpinner();
        const metal_id = $event;
        let res = await this.service.GetAll('v1/Purity/List');
        if(res?.length > 0)
        {
            this.PurityList = res.filter(o=> o.metal_id == metal_id);
            delete this.SearchData.purity_id;
        }
        else
        {
            this.PurityList = [];
        }
        this.helper.HideSpinner();
    }

    async GetBusinessList(categoryId)
    {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll('v1/Business/List');
        if(res?.length > 0)
        {
            this.BusinessDropdown = res.filter(business => business.business_category_id === categoryId);
        }
        else
        {
            this.BusinessDropdown = [];
        }
        this.helper.HideSpinner();
    }

    async GetBusinessCategoryList()
    {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll('v1/BusinessCategory/List');  
        if(res?.length > 0)
        {
            this.BusinessCategoryDropdown = res;
        }
        else
        {
            this.BusinessCategoryDropdown = [];
        }
        this.helper.HideSpinner();
    }

    
    async GetBusinessLedgerList(value: string)
    {
        if(this.FilterForm.valid)
        {
            this.helper.ShowSpinner();
            let res = await this.service.CommonPost(this.SearchData, 'v1/StockReport/BusinessLedgerFilterList');
            if(res?.length > 0)
            {
                this.BusinessLedgerList = res;
            }
            else
            {
                this.BusinessLedgerList = [];
            }
            this.helper.HideSpinner();
        }
        else
        {
            this.helper.validateAllFormFields(this.FilterForm)
        }
    }


    async DownloadExcel()
    {
        let res = await this.service.DownloadPost(this.SearchData, 'v1/StockReport/BusinessListDownload');
        this.helper.ExceldownloadAsBlob(res, false);
        this.helper.SucessToastr("Downloaded Successfully");
    }


    CalculateStockIn(){
        const total =  this.BusinessLedgerList?.reduce((total, item) => {
             return total + (item.stock_in  - 0);
        }, 0);
        return total.toFixed(3);
    }


    CalculateStockOut(){
        const total = this.BusinessLedgerList?.reduce((total, item) => {
            return total + (item.stock_out  - 0);
        }, 0);
        return total.toFixed(3);
    }

    CalculateStockWeightBalance(){
        const total = this.BusinessLedgerList?.reduce((total, item) => {
            return total + (item.stock_in  - item.stock_out);
        }, 0);
        return total.toFixed(3);
    }

    CalculateAmountIn(){
        const total = this.BusinessLedgerList?.reduce((total, item) => {
            return total + (item.amount_in  - 0);
        }, 0);
        return total.toFixed(2);
    }

    CalculateAmountOut(){
        const total = this.BusinessLedgerList?.reduce((total, item) => {
            return total + (item.amount_out  - 0);
        }, 0);
        return total.toFixed(2);
    }

    CalculateAmountBalance(){
        const total = this.BusinessLedgerList?.reduce((total, item) => {
            return total + (item.amount_in  - item.amount_out);
        }, 0);
        return total.toFixed(2);
    }

    CalculateStockBalance(){
        const total = this.BusinessLedgerList?.reduce((total, item) => {
            return total + (item.stock_in  - item.stock_out);
        }, 0);
        return total.toFixed(3);
    }

    CalculateQualityIn(){
        const total = this.BusinessLedgerList?.reduce((total, item) => {
            return total + (item.qty_in  - 0);
        }, 0);
        return total.toFixed(0);
    }

    CalculateQualityOut(){
        const total = this.BusinessLedgerList?.reduce((total, item) => {
            return total + (item.qty_out  - 0);
        }, 0);
        return total.toFixed(0);
    }

    
    CalculateQtyBalance(){
        const total = this.BusinessLedgerList?.reduce((total, item) => {
            return total + (item.qty_in  - item.qty_out);
        }, 0);
        return total.toFixed(0);
    }
    
    CalculateFineWtyIn(){
        const total = this.BusinessLedgerList?.reduce((total, item) => {
            return total + (item.fine_weight_in  - 0);
        }, 0);
        return total.toFixed(3);
    }
    
    CalculateFineWtyOut(){
        const total = this.BusinessLedgerList?.reduce((total, item) => {
            return total + (item.fine_weight_out  - 0);
        }, 0);
        return total.toFixed(3);
    }
    
    CalculateFineWtyBalance(){
        const total = this.BusinessLedgerList?.reduce((total, item) => {
            return total + (item.fine_weight_in  - item.fine_weight_out);
        }, 0);
        return total.toFixed(3);
    }

}

const routes: Routes = [
    { path: "", component: BusinessLedgerComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BusinessLedgerRoutingModule { }

@NgModule({
    declarations: [BusinessLedgerComponent],
    imports: [
        CommonModule,
        BusinessLedgerRoutingModule,
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
export class BusinessLedgerModule { }
