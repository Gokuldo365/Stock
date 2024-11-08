import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModuleData } from 'src/Helper/Modules';
import { CommonHelper } from 'src/Helper/CommonHelper';
import { CommonService } from 'src/Service/Common.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormControlOptions, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';;
import { FloatLabelModule } from 'primeng/floatlabel';
import { EditorModule } from 'primeng/editor';
import { StickyPageHeaderComponent } from 'src/app/Shared/sticky-page-header/sticky-page-header.component';
import { MTemplateDirective } from 'src/Directives/template.directive';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploaderComponent } from 'src/app/Shared/file-uploader/file-uploader.component';
import { OrderListModule } from 'primeng/orderlist';
import { PurchaseDetailModel, PurchaseSalesModel } from 'src/Model/PurchaseSales.model';
import { CalendarModule } from 'primeng/calendar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ConfirmationService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
    selector: 'app-receipt',
    templateUrl: './receipt.component.html',
    providers: [ConfirmationService]
})

export class ReceiptComponent implements OnInit {
    ReceiptAndProductForm : FormGroup;
    ReceiptAndProductData : any = {gross_weight : 0.000 , other_weight : 0.000 , net_weight : 0.000 , fine_weight : 0.000 , melting : 0.00 , wastage : 0.00 , other_charges : 0.00 , mc_amount : 0.00};
    StockProductForm : FormGroup;
    StockProductData : any = {};
    StockEntryProductList : any = [];
    ReceiptId : number = 0;
    ReceiptDetailId : number = 0;
    CurrencySymbol : string = "";
    MetalList : any = [];
    PurityList : any = [];
    BusinessList : any = [];
    EmployeeList : any = [];
    headerPinned : boolean = false;
    CategoryList : any = [];
    ProductList : any = [];
    CombinationList : any = [];
    ProductDetailList : any = [];
    MixedMaterialList : any = [];
    IsEdit : boolean = false;
    HistoryNote : string = "";
    RouteType: string = "";
    SalesTypeList : any = [{name: 'Job Work'},{name : "Sales"},{name : "Other"}];
    EnableRateCut : boolean = false;
    StockEntryRateCutData : any = {rate_cut_weight : 0.000 , gold_rate : 0.00 , rate_per_gram : 0 , item_amount : 0.00 , other_amount : 0.00 , gross_amount : 0.00 , gst : 5 , gst_amount : 0.00 , tcs_tds : 2 , tcs_tds_amount : 0.00 , discount : 0 , total_amount : 0.00};
    RateCutForm : FormGroup;

    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private confirmationService: ConfirmationService,
        private formbuilder: FormBuilder,
    ) {
        this.ReceiptAndProductData.stock_entry_date_time = new Date();
    }

    async ngOnInit() {
        this.helper.ShowSpinner();
        this.ReceiptId = this.route.snapshot.params["id"];
        this.RouteType = this.route.snapshot.params["type"];

        if(this.ReceiptId == 0)
        {
            this.ReceiptAndProductFormValidation();
        }
        else
        {
            this.ReceiptStockEntryValidation();
        }
        await this.GetMetalList();
        await this.GetBusinessList();
        await this.GetEmployeeList();
        await this.GetReceiptById();
        this.CurrencySymbol = this.helper.GetDefaultCurrency();
        this.helper.HideSpinner();
    }

    ReceiptAndProductFormValidation()
    {
        this.ReceiptAndProductForm = this.formbuilder.group({
            // stock_number: new FormControl('', Validators.compose([Validators.nullValidator])),
            stock_entry_date_time: new FormControl('', Validators.compose([Validators.required])),
            business_id: new FormControl('', Validators.compose([Validators.required])),
            hand_over_name: new FormControl('', Validators.compose([Validators.required])),
            metal_id: new FormControl('', Validators.compose([Validators.required])),
            purity_id: new FormControl('', Validators.compose([Validators.required])),
            sales_type: new FormControl('', Validators.compose([Validators.required])),
            category_id: new FormControl('', Validators.compose([Validators.required])),
            product_id: new FormControl('', Validators.compose([Validators.required])),
            product_variants_id: new FormControl('', Validators.compose([Validators.nullValidator])),
            combination: new FormControl('', Validators.compose([Validators.nullValidator])),
            stock_qty: new FormControl('', Validators.compose([Validators.required,Validators.min(1)])),
            gross_weight: new FormControl('0.000', Validators.compose([Validators.required])),
            other_weight: new FormControl('0.000', Validators.compose([Validators.required])),
            net_weight: new FormControl('0.000', Validators.compose([Validators.required])),
            melting: new FormControl('', Validators.compose([Validators.required])),
            wastage: new FormControl('', Validators.compose([Validators.nullValidator])),
            fine_weight: new FormControl('0.000', Validators.compose([Validators.required])),
            other_charges:new FormControl('', Validators.compose([Validators.nullValidator])),
            mc_amount:new FormControl('0.00', Validators.compose([Validators.nullValidator])),
            lab_rate:new FormControl('0.00', Validators.compose([Validators.nullValidator])),
            amount:new FormControl('0.00', Validators.compose([Validators.nullValidator])),
            // gst:new FormControl('0', Validators.compose([Validators.nullValidator])),
            // gst_amount:new FormControl('0.00', Validators.compose([Validators.nullValidator])),
            // tcs_tds:new FormControl('0', Validators.compose([Validators.nullValidator])),
            // tcs_tds_amount:new FormControl('0.00', Validators.compose([Validators.nullValidator])),
            // discount:new FormControl('0', Validators.compose([Validators.nullValidator])),
            // total_amount:new FormControl('0.00', Validators.compose([Validators.nullValidator])),
            // New And Edit Based On Condition
            note: new FormControl('', Validators.compose([Validators.nullValidator])),
            // New And Edit Based On Condition
        });
    }

    ReceiptStockEntryValidation()
    {
        this.ReceiptAndProductForm = this.formbuilder.group({
            // Info
            stock_entry_date_time: new FormControl('', Validators.compose([Validators.nullValidator])),
            business_id: new FormControl('', Validators.compose([Validators.nullValidator])),
            hand_over_name: new FormControl('', Validators.compose([Validators.nullValidator])),
            metal_id: new FormControl('', Validators.compose([Validators.nullValidator])),
            purity_id: new FormControl('', Validators.compose([Validators.nullValidator])),
            sales_type: new FormControl('', Validators.compose([Validators.required])),
            // Info

            stock_entry_id: new FormControl('', Validators.compose([Validators.nullValidator])),
            category_id: new FormControl('', Validators.compose([Validators.required])),
            product_id: new FormControl('', Validators.compose([Validators.required])),
            product_variants_id: new FormControl('', Validators.compose([Validators.nullValidator])),
            combination: new FormControl('', Validators.compose([Validators.nullValidator])),
            stock_qty: new FormControl('', Validators.compose([Validators.required,Validators.min(1)])),
            gross_weight: new FormControl('', Validators.compose([Validators.required])),
            other_weight: new FormControl('', Validators.compose([Validators.required])),
            net_weight: new FormControl('', Validators.compose([Validators.required])),
            melting: new FormControl('', Validators.compose([Validators.required])),
            wastage: new FormControl('', Validators.compose([Validators.nullValidator])),
            fine_weight: new FormControl('', Validators.compose([Validators.required])),
            other_charges:new FormControl('', Validators.compose([Validators.nullValidator])),
            mc_amount:new FormControl('', Validators.compose([Validators.nullValidator])),
            note: new FormControl('', Validators.compose([Validators.nullValidator])),
        });
    }

    RateCutFormValidation()
    {
        
        if(this.StockEntryRateCutData.rate_cut_weight != null && this.StockEntryRateCutData.rate_cut_weight != 0)
        {
            this.RateCutForm = this.formbuilder.group({
                sales_type: new FormControl('', Validators.compose([Validators.nullValidator])),
                rate_cut_weight: new FormControl('', Validators.compose([Validators.nullValidator])),
                item_amount: new FormControl('', Validators.compose([Validators.nullValidator])),
                other_amount: new FormControl('', Validators.compose([Validators.nullValidator])),
                gross_amount: new FormControl('', Validators.compose([Validators.nullValidator])),
                gst_amount: new FormControl('', Validators.compose([Validators.nullValidator])),
                tcs_tds_amount: new FormControl('', Validators.compose([Validators.nullValidator])),
                discount: new FormControl('', Validators.compose([Validators.nullValidator])),
                total_amount: new FormControl('', Validators.compose([Validators.nullValidator])),
                gold_rate: new FormControl('', Validators.compose([Validators.required,Validators.min(1)])),
                rate_per_gram: new FormControl('', Validators.compose([Validators.required,Validators.min(1)])),
                gst: new FormControl('', Validators.compose([Validators.required,Validators.min(1)])),
                tcs_tds: new FormControl('', Validators.compose([Validators.required,Validators.min(1)])),
            });
        }
        else
        {
            this.RateCutForm = this.formbuilder.group({
                sales_type: new FormControl('', Validators.compose([Validators.nullValidator])),
                rate_cut_weight: new FormControl('', Validators.compose([Validators.nullValidator])),
                item_amount: new FormControl('', Validators.compose([Validators.nullValidator])),
                other_amount: new FormControl('', Validators.compose([Validators.nullValidator])),
                gross_amount: new FormControl('', Validators.compose([Validators.nullValidator])),
                gst_amount: new FormControl('', Validators.compose([Validators.nullValidator])),
                tcs_tds_amount: new FormControl('', Validators.compose([Validators.nullValidator])),
                discount: new FormControl('', Validators.compose([Validators.nullValidator])),
                total_amount: new FormControl('', Validators.compose([Validators.nullValidator])),
                gold_rate: new FormControl('', Validators.compose([Validators.nullValidator])),
                rate_per_gram: new FormControl('', Validators.compose([Validators.nullValidator])),
                gst: new FormControl('', Validators.compose([Validators.nullValidator])),
                tcs_tds: new FormControl('', Validators.compose([Validators.nullValidator])),
            });
        }
    }

    ReceiptValidationMessages = {
        'stock_entry_date_time': [{ type: 'required', message: 'Required.' },],
        'business_id': [{ type: 'required', message: 'Required.' },],
        'hand_over_name': [{ type: 'required', message: 'Required.' },],
        'metal_id': [{ type: 'required', message: 'Required.' },],
        'purity_id': [{ type: 'required', message: 'Required.' },],
        'sales_type': [{ type: 'required', message: 'Required.' },],
        'category_id': [{ type: 'required', message: 'Required.' },],
        'product_id': [{ type: 'required', message: 'Required.' },],
        'combination': [{ type: 'required', message: 'Required.' },],
        'product_variants_id': [{ type: 'required', message: 'Required.' },],
        'stock_qty': [{ type: 'required', message: 'Required.' }, {type : 'min' , message : 'Should not be zero.'}],
        'gross_weight': [{ type: 'required', message: 'Required.' },],
        'other_weight': [{ type: 'required', message: 'Required.' },],
        'net_weight': [{ type: 'required', message: 'Required.' },],
        'melting': [{ type: 'required', message: 'Required.' },],
        'wastage': [{ type: 'required', message: 'Required.' },],
        'fine_weight': [{ type: 'required', message: 'Required.' },],
        'other_charges': [{ type: 'required', message: 'Required.' },],
        'mc_amount': [{ type: 'required', message: 'Required.' },],
        'note': [{ type: 'required', message: 'Required.' },],
    };

    ProductEntryValidationMessage = {
        'stock_entry_id': [{ type: 'required', message: 'Required.' },],
        'category_id': [{ type: 'required', message: 'Required.' },],
        'product_id': [{ type: 'required', message: 'Required.' },],
        'stock_qty': [{ type: 'required', message: 'Required.' },{type : 'min' , message : 'Should not be zero.'}],
        'gross_weight': [{ type: 'required', message: 'Required.' },],
        'other_weight': [{ type: 'required', message: 'Required.' },],
        'net_weight': [{ type: 'required', message: 'Required.' },],
        'melting': [{ type: 'required', message: 'Required.' },],
        'fine_weight': [{ type: 'required', message: 'Required.' },],
        'other_charges': [{ type: 'required', message: 'Required.' },],
        'mc_amount': [{ type: 'required', message: 'Required.' },],
        'note': [{ type: 'required', message: 'Required.' },],
    }

    RateCutValidationMessage = {
        'gold_rate': [{ type: 'required', message: 'Required.' },{type : 'min' , message : 'Should not be zero.'}],
        'rate_per_gram': [{ type: 'required', message: 'Required.' },{type : 'min' , message : 'Should not be zero.'}],
        'gst': [{ type: 'required', message: 'Required.' },{type : 'min' , message : 'Should not be zero.'}],
        'tcs_tds': [{ type: 'required', message: 'Required.' },{type : 'min' , message : 'Should not be zero.'}],
    }

    async GetReceiptById() {
        this.helper.ShowSpinner();
        if(this.ReceiptId == 0)
        {
            this.ReceiptAndProductData.stock_number = "AUTO NUMBER";
        }
        else
        {
            const res = await this.service.GetById(this.ReceiptId, `v1/StockEntry/StockEntry`);
            this.ReceiptAndProductData = res;
            if(this.ReceiptId != 0)
            {
                await this.GetPurityList(this.ReceiptAndProductData.metal_id);
            }
            await this.GetProductDetailList(this.ReceiptAndProductData.purity_id)
            await this.GetStockEntryProductList(this.ReceiptId);
            this.ReceiptAndProductData.category_id = null;
            this.ReceiptAndProductData.product_id = null;
            this.ReceiptAndProductData.stock_qty = 0.00;
            this.ReceiptAndProductData.product_variants_id = null;
            this.ReceiptAndProductData.gross_weight = 0.000;
            this.ReceiptAndProductData.other_weight = 0.000;
            this.ReceiptAndProductData.net_weight = 0.000;
            this.ReceiptAndProductData.melting = 0.00;
            this.ReceiptAndProductData.wastage = 0.00;
            this.ReceiptAndProductData.fine_weight = 0.000;
            this.MixedMaterialList = [];
            this.ReceiptAndProductData.other_charges = 0.00;
            this.ReceiptAndProductData.mc_amount = 0.00;
            this.ReceiptDetailId = 0;
        }
        this.helper.HideSpinner();
    }

    async GetMetalList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll('v1/Metal/List');
        if (res?.length > 0)
        {
            this.MetalList = res;
            
        }
        else 
        {
            this.MetalList = [];
        }
        this.helper.HideSpinner();
    }

    async GetPurityList(metalId: string) {
        this.helper.ShowSpinner();
        const metal_id = metalId;
        let res = await this.service.GetAll('v1/Purity/List');
        if (res?.length > 0) {
            this.PurityList = res.filter(o => o.metal_id == metal_id);
        }
        else {
            this.PurityList = [];
        }
        this.helper.HideSpinner();
    }

    async GetBusinessList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll('v1/Business/List');
        if (res?.length > 0)
        {
            this.BusinessList = res;
        }
        else
        {
            this.BusinessList = [];
        }
        this.helper.HideSpinner();
    }

    async GetEmployeeList()
    {
        this.helper.ShowSpinner();
        const res = await this.service.GetAll('v1/Employee/List');
        if(res?.length > 0)
        {
            this.EmployeeList = res;
            this.ReceiptAndProductData.received_by_id = this.EmployeeList[0].id;
        }
        else
        {
            this.EmployeeList = [];
        }
        this.helper.HideSpinner();
    }

    async GetProductDetailList($event)
    {
        this.helper.ShowSpinner();
        const purity_id = $event;
        const res = await this.service.CommonPost({metal_id : this.ReceiptAndProductData.metal_id , purity_id : purity_id},'v1/StockEntryDetail/StockProductList');
        if(res?.length > 0)
        {
            this.ProductDetailList = res;
        }
        else
        {
            this.ProductDetailList = [];
        }
        const PurityData = this.PurityList.filter(o=> o.id == purity_id)[0];
        this.ReceiptAndProductData.melting = Number(PurityData.melting);
        this.helper.HideSpinner();
    }

    GetProductListByCategory($event)
    {
        this.helper.ShowSpinner();
        const category_id = $event;
        this.ProductList = this.ProductDetailList.filter(o=> o.category_id == category_id);
        this.helper.HideSpinner();
    }

    async GetProductVariantList($event)
    {
        this.helper.ShowSpinner();
        const product_id = $event;
        let res = await this.service.GetAll(`v1/StockEntryDetail/StockVarientList/${product_id}`);
        if(res?.length > 0)
        {
            if(this.ReceiptId == 0)
            {
                const CombinationValidation = this.ReceiptAndProductForm.get('product_variants_id');
                CombinationValidation.setValidators([Validators.required]);
                CombinationValidation.updateValueAndValidity();
            }
            else
            {
                const CombinationValidation = this.ReceiptAndProductForm.get('product_variants_id');
                CombinationValidation.setValidators([Validators.required]);
                CombinationValidation.updateValueAndValidity();
            }
            this.CombinationList = res;
        }
        else
        {
            this.CombinationList = [];
            const CombinationValidationNew = this.ReceiptAndProductForm.get('product_variants_id');
            const CombinationValidationEdit = this.ReceiptAndProductForm.get('product_variants_id');
            CombinationValidationNew.setValidators([Validators.nullValidator]);
            CombinationValidationNew.updateValueAndValidity();
            CombinationValidationEdit.setValidators([Validators.nullValidator]);
            CombinationValidationEdit.updateValueAndValidity();
            this.ReceiptAndProductData.product_variants_id = null;
            this.ReceiptAndProductData.combination = null;
        }
        const mixed_material_res = await this.service.GetAll(`v1/StockEntryDetail/StockMixedMaterialList/${product_id}`);
        if(mixed_material_res?.length > 0)
        {
            for (const item of mixed_material_res)
            {
                item["weight"] = 0.000;
                item["amount"] = 0.00
            }
            this.MixedMaterialList = mixed_material_res;
        }
        else
        {
            this.MixedMaterialList = [];   
        }
        this.helper.HideSpinner();
    }

    ProductVariantAndCombinationValue($event)
    {
        const VariantId = $event;
        this.ReceiptAndProductData.product_variants_id = VariantId;
        this.ReceiptAndProductData.combination = this.CombinationList.filter(o=> o.id == VariantId)[0].combination;
    }

    GetFineAndNetWeightCalculation(gross_weight)
    {
        const GrossWeight = gross_weight;
        if(GrossWeight != null)
        {
            this.ReceiptAndProductData.net_weight = GrossWeight - this.ReceiptAndProductData.other_weight;
            this.ReceiptAndProductData.fine_weight = this.ReceiptAndProductData.net_weight;
        }
    }

    GetOverAllOtherWeightAndAmount()
    {
        this.ReceiptAndProductData.other_weight = this.MixedMaterialList.reduce((sum, material) => sum + material.weight, 0);  
        this.ReceiptAndProductData.other_charges = this.MixedMaterialList.reduce((sum, material) => sum + material.amount, 0);
        if(this.ReceiptAndProductData.gross_weight != null)
        {
            this.ReceiptAndProductData.net_weight = Number(this.ReceiptAndProductData.gross_weight) - Number(this.ReceiptAndProductData.other_weight);
            this.ReceiptAndProductData.fine_weight = this.ReceiptAndProductData.net_weight;
        }
        if(this.ReceiptAndProductData.melting != 0.00 && this.ReceiptAndProductData.melting != null)
        {
            const FineWeight = (Number(this.ReceiptAndProductData.melting) + Number(this.ReceiptAndProductData.wastage)) * this.ReceiptAndProductData.net_weight / 100;
            this.ReceiptAndProductData.fine_weight = Number(FineWeight);
        }
        
    }

    GetFineWeightByMelting($event)
    {
        const Melting = $event;
        if(Melting != null)
        {
            this.ReceiptAndProductData.fine_weight = (Number(this.ReceiptAndProductData.melting) + Number(this.ReceiptAndProductData.wastage)) * this.ReceiptAndProductData.net_weight / 100;
        }
        else
        {
            this.ReceiptAndProductData.fine_weight = Number(this.ReceiptAndProductData.gross_weight);
        }
    }

    GetFineWeightCalculation($event)
    {
        const Wastage = $event;
        if(Wastage != null)
        {
            if(this.ReceiptAndProductData.melting != 0.00 && this.ReceiptAndProductData.melting != null)
            {
                const FineWeight = (Number(this.ReceiptAndProductData.melting) + Number(Wastage)) * this.ReceiptAndProductData.net_weight / 100;
                this.ReceiptAndProductData.fine_weight = Number(FineWeight);
            }
        }
        else
        {
            this.ReceiptAndProductData.fine_weight = (Number(this.ReceiptAndProductData.melting) + 0.00) * this.ReceiptAndProductData.net_weight / 100;
        }
    }

    async SaveOrUpdateReceipt()
    {
        if(this.ReceiptAndProductForm.valid)
        {
            this.helper.ShowSpinner();
            let res : any;
            this.ReceiptAndProductData.stock_entry_type = "Receipt";
            if(this.MixedMaterialList?.length > 0)
            {
                const MixedMaterialData : any = [];
                for (const obj of this.MixedMaterialList)
                {
                    MixedMaterialData.push({
                        mixed_material_id : obj.id,
                        weight : obj.weight,
                        amount : obj.amount
                    })
                }
                this.ReceiptAndProductData.mixed_material = MixedMaterialData;
            }
            else
            {
                this.ReceiptAndProductData.mixed_material = [];
            }
            res = await this.service.CommonPost(this.ReceiptAndProductData,'v1/StockEntryDetail/Insert');
            if(res.Type == "S")
            {
                this.helper.HideSpinner();
                this.helper.SucessToastr(res.Message);
                this.router.navigateByUrl(`/`, {skipLocationChange: true}).then(
                    () => this.router.navigate([`/Receipt/${res.AddtionalData}/R`])
                );
                this.ReceiptAndProductFormValidation();
                this.ReceiptAndProductData = {gross_weight : 0.000 , other_weight : 0.000 , net_weight : 0.000 , fine_weight : 0.000 , melting : 0.00 , wastage : 0.00 , other_charges : 0.00 , mc_amount : 0.00};
                await this.GetStockEntryProductList(res.AddtionalData);
            }
            else
            {
                this.helper.HideSpinner();
                this.helper.ErrorToastr(res.Message);
            }
        }
        else
        {
            this.helper.validateAllFormFields(this.ReceiptAndProductForm);
        }
    }

    Cancel(type: string)
    {
        if(this.RouteType == "D"){
            this.helper.redirectTo('Dashboard');
        }
        else{
            this.helper.redirectTo('ReceiptList');
        }
    }

    async GetStockEntryProductList(receipt_id)
    {
        this.helper.ShowSpinner();
        this.ReceiptId = receipt_id;
        const res = await this.service.GetAll(`v1/StockEntryDetail/StockEntryDetailList/${this.ReceiptId}`);
        if(res?.length > 0)
        {
            for (const item of res)
            {
                item.history = JSON.parse(item?.history);
                item.mixed_material = JSON.parse(item?.mixed_material);
            }
            this.StockEntryProductList = res;
        }
        else
        {
            this.StockEntryProductList = [];
        }
        this.helper.HideSpinner();
    }

    async EditProductEntry(id)
    {
        this.helper.ShowSpinner();
        this.ReceiptDetailId = id;
        this.IsEdit = true;
        this.ReceiptStockEntryValidation();
        const res = await this.service.GetById(this.ReceiptDetailId, 'v1/StockEntryDetail/StockEntryDetailById');
        this.ReceiptAndProductData = res[0];
        await this.GetBusinessList();
        await this.GetMetalList();
        this.ReceiptAndProductData.stock_number = res[0].stock_info_stock_number;
        this.ReceiptAndProductData.stock_entry_date_time = new Date(res[0].stock_info_stock_entry_date_time);
        this.ReceiptAndProductData.business_id = res[0].stock_info_business;
        this.ReceiptAndProductData.hand_over_name = res[0].stock_info_hand_over_name;
        this.ReceiptAndProductData.metal_id = res[0].stock_info_metal_id;
        this.ReceiptAndProductData.purity_id = res[0].stock_info_purity_id;
        this.ReceiptAndProductData.note = res[0].stock_info_note;
        const MixedMaterialData = JSON.parse(this.ReceiptAndProductData.mixed_material);
        if(MixedMaterialData != null)
        {
            for (const item of MixedMaterialData)
            {
                item["material_name"] = item.name;
            }
            this.MixedMaterialList = MixedMaterialData;
        }
        else
        {
            this.MixedMaterialList = [];
        }
        const info_res = await this.service.GetById(this.ReceiptId, `v1/StockEntry/StockEntry`);
        const Category_Product_res = await this.service.CommonPost({metal_id : info_res.metal_id , purity_id : info_res.purity_id},'v1/StockEntryDetail/StockProductList');
        this.ProductDetailList = Category_Product_res;
        const EditFormValidation = this.ReceiptAndProductForm.get('note');
        EditFormValidation.setValidators([Validators.required]);
        EditFormValidation.updateValueAndValidity();
        this.helper.HideSpinner();
    }

    async SaveOrUpdateReceiptProduct()
    {
        if(this.ReceiptAndProductForm.valid)
        {
            this.helper.ShowSpinner();
            let res : any;
            let SaveData : any = {};
            SaveData.mixed_material = [];
            SaveData.stock_entry_id = this.ReceiptId;
            SaveData.product_id = this.ReceiptAndProductData.product_id;
            SaveData.product_variants_id = this.ReceiptAndProductData.product_variants_id;
            SaveData.combination = this.ReceiptAndProductData.combination;
            SaveData.stock_qty = this.ReceiptAndProductData.stock_qty;
            SaveData.gross_weight = this.ReceiptAndProductData.gross_weight;
            SaveData.other_weight = this.ReceiptAndProductData.other_weight;
            SaveData.net_weight = this.ReceiptAndProductData.net_weight;
            SaveData.other_charges = this.ReceiptAndProductData.other_charges;
            SaveData.melting = this.ReceiptAndProductData.melting;
            SaveData.wastage = this.ReceiptAndProductData.wastage;
            SaveData.fine_weight = this.ReceiptAndProductData.fine_weight;
            SaveData.mc_amount = this.ReceiptAndProductData.mc_amount;
            SaveData.history_note = this.HistoryNote ?? "";
            const MixedMaterialData : any = [];
            if(this.ReceiptDetailId == 0)
            {
            for (const obj of this.MixedMaterialList)
                {
                    MixedMaterialData.push({
                        mixed_material_id : obj.id,
                        weight : obj.weight,
                        amount : obj.amount
                    })
                }
            }
            else
            {
            for (const obj of this.MixedMaterialList)
                {
                    MixedMaterialData.push({
                        mixed_material_id : obj.product_mixed_material_id,
                        weight : obj.weight,
                        amount : obj.amount
                    })
                }
            }
            SaveData.mixed_material = MixedMaterialData;
            if(this.ReceiptDetailId == 0)
            {
                res = await this.service.CommonPost(SaveData,'v1/StockEntryDetail/StockEntryDeailInsert');
            }
            else
            {
                res = await this.service.CommonPut(SaveData,`v1/StockEntryDetail/Update/${this.ReceiptDetailId}`);
            }
            if(res.Type == "S")
            {
                this.helper.HideSpinner();
                this.helper.SucessToastr(res.Message);
                await this.GetStockEntryProductList(this.ReceiptId);
                this.ReceiptStockEntryValidation();
                this.ReceiptAndProductData = {gross_weight : 0.000 , other_weight : 0.000 , net_weight : 0.000 , fine_weight : 0.000 , melting : 0.00 , wastage : 0.00 , other_charges : 0.00 , mc_amount : 0.00};
                this.IsEdit = false;
                await this.GetReceiptById();
            }
            else
            {
                this.helper.HideSpinner();
                this.helper.ErrorToastr(res.Message);
            }
        }
        else
        {
            this.helper.validateAllFormFields(this.ReceiptAndProductForm);
        }
    }
    

    ClearProductEntry()
    {
        this.ReceiptAndProductData.category_id = null;
        this.ReceiptAndProductData.product_id = null;
        this.ReceiptAndProductData.stock_qty = 0.00;
        this.ReceiptAndProductData.product_variants_id = null;
        this.ReceiptAndProductData.gross_weight = 0.000;
        this.ReceiptAndProductData.other_weight = 0.000;
        this.ReceiptAndProductData.net_weight = 0.000;
        this.ReceiptAndProductData.melting = 0.00;
        this.ReceiptAndProductData.wastage = 0.00;
        this.ReceiptAndProductData.fine_weight = 0.000;
        this.MixedMaterialList = [];
        this.ReceiptAndProductData.other_charges = 0.00;
        this.ReceiptAndProductData.mc_amount = 0.00;
        this.ReceiptDetailId = 0;
        this.IsEdit = false;
    }

    RateCutEnable($event)
    {
        this.EnableRateCut == $event;
        this.StockEntryRateCutData.sales_type = this.ReceiptAndProductData.sales_type;
        this.RateCutFormValidation();
    }

    RateCutValidation($event)
    {
        this.StockEntryRateCutData.rate_cut_weight = Number($event);
        this.RateCutFormValidation();
    }

    async SaveOrUpdateRateCutDetail()
    {
        this.helper.ShowSpinner();
        let res = await this.service.CommonPost(this.StockEntryRateCutData,'v1/StockEntryDetail/RateCutCalculation');
        if(res.Type == "S")
        {
            this.helper.HideSpinner();
            this.helper.SucessToastr(res.Message);
        }
        else
        {
            this.helper.HideSpinner();
            this.helper.SucessToastr(res.Message);
        }
    }

}

const routes: Routes = [
    { path: "", component: ReceiptComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReceiptRoutingModule { }

@NgModule({
    declarations: [ReceiptComponent],
    imports: [
        CommonModule,
        ReceiptRoutingModule,
        ModuleData,
        DropdownModule,
        TableModule,
        ButtonModule,
        CardModule,
        InputTextModule,
        FloatLabelModule,
        EditorModule,
        StickyPageHeaderComponent,
        MTemplateDirective,
        DialogModule,
        TabViewModule,
        PanelModule,
        DropdownModule,
        FileUploadModule,
        MultiSelectModule,
        CheckboxModule,
        FileUploaderComponent,
        OrderListModule,
        CalendarModule,
        IconFieldModule,
        InputGroupModule,
        InputGroupAddonModule,
        InputTextareaModule,
        OverlayPanelModule,
        InputSwitchModule
    ],
})
export class ReceiptModule { }
