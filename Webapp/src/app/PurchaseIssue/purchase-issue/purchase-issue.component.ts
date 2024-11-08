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

@Component({
    selector: 'app-purchase-issue',
    templateUrl: './purchase-issue.component.html',
    providers: [ConfirmationService]
})

export class PurchaseIssueComponent implements OnInit {
    purchaseReceiptForm = this.fb.group({
        id: [''],
        status: [''],
        stock_number: [''],
        stock_entry_date_time: ['', [Validators.required]],
        hand_over_id: ['', [Validators.required]],
        stock_entry_type: ['PurchaseIssue'],
        received_by_id: ['', [Validators.required]],
        metal_id: ['', [Validators.required]],
        purity_id: ['', [Validators.required]],
        business_from_id: ['', [Validators.required]],
        business_to_id: ['', [Validators.required]],
        note: [''],
    }, { validators: this.hasDuplicateEmployee('hand_over_id', 'received_by_id', 'business_from_id', 'business_to_id') } as FormControlOptions);
    headerPinned: boolean = false;
    PurchaseReceiptId: any = 0;
    PurchaseReceiptData: PurchaseSalesModel = new PurchaseSalesModel();
    EmployeeList: any = [];
    MetalList: any = [];
    PurityList: any = [];
    BusinessList: any = [];
    PurchaseDialouge: boolean = false;
    PurchaseReceiptDetailForm: FormGroup = this.fb.group({
        id: [''],
        status: [''],
        stock_entry_id: [''],
        category_id: ['', Validators.required],
        product_id: ['', Validators.required],
        product_variants_id: [''],
        product_variants_id_proxy: [''],
        combination: [''],
        stock_qty: ['', Validators.required],
        gross_weight: ['', Validators.required],
        other_weight: ['', Validators.required],
        net_weight: ['', Validators.required],
        other_charges: [0.00],
        melting: ['', Validators.required],
        wastage: ['', Validators.nullValidator],
        fine_weight: ['', Validators.required],
        mc_amount: [0],
        mixed_material: this.fb.array([]),
        notes: [''],
    });
    PurchaseReceiptDetailData: PurchaseDetailModel = new PurchaseDetailModel();
    PurchaseDetailId: any = 0;
    DetailList: any = [];
    CategoryDropdown: any = [];
    ProductList: any = [];
    ProductVariantList: any = [];
    MixedMaterialList: any = [];
    PurchaseReceiptDetailList: any = [];
    selectedVariantCombination: any = [];
    stockProductList: any[] = [];
    productList: any[] = [];
    variantList: any[] = [];
    CurrencySymbol : string = "";
    get purchaseReceiptFc() {
        return this.purchaseReceiptForm.controls;
    }

    get PurchaseReceiptDetailFC() {
        return this.PurchaseReceiptDetailForm.controls;
    }

    get mixedMaterialFA() {
        return this.PurchaseReceiptDetailForm.get('mixed_material') as FormArray;
      }
    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private confirmationService: ConfirmationService
    ) {
        this.PurchaseReceiptData.stock_entry_date_time = new Date();
    }

    async ngOnInit() {
        this.helper.ShowSpinner();
        this.PurchaseReceiptId = this.route.snapshot.params["id"];
        this.PurchaseReceiptId != 0 && await this.GetPurchaseReceiptById();
        // this.PurchaseReceiptId != 0 && this.purchaseReceiptForm.disable();
        await this.GetEmployeeList();
        await this.GetMetalList();
        await this.GetBusinessList();
        await this.GetPurchaseReceiptDetailList();
        this.PurchaseReceiptId != 0 && await this.GetPurityList(this.purchaseReceiptFc.metal_id.value);
        this.PurchaseReceiptDetailForm.get('gross_weight').valueChanges.subscribe((value) => {
            this.calculateNetWeight(value, this.mixedMaterialFA.value)
          });
          this.PurchaseReceiptDetailForm.get('mixed_material').valueChanges.subscribe(async (value) => {      
            this.calculateNetWeight(this.PurchaseReceiptDetailFC.gross_weight.value, value);
            const otherCharge = value.reduce((accumulator, currentValue) => +accumulator + (currentValue.amount ? +currentValue.amount : 0),0);
            this.PurchaseReceiptDetailForm.get('other_charges').setValue(otherCharge); 
          });
        this.CurrencySymbol = this.helper.GetDefaultCurrency();
        this.helper.HideSpinner();
    }

    PurchaseReceiptValidationMessages = {
        'stock_entry_date_time': [{ type: 'required', message: 'Required.' },],
        'hand_over_id': [
            { type: 'required', message: 'Required.' },
            { type: 'isDuplicate', message: 'Handover by name already exist.'}
        ],
        'stock_entry_type': [{ type: 'required', message: 'Required.' },],
        'received_by_id': [
            { type: 'required', message: 'Required.' },
            { type: 'isDuplicate', message: 'Received by name already exist.'}      
        ],
        'metal_id': [{ type: 'required', message: 'Required.' },],
        'purity_id': [{ type: 'required', message: 'Required.' },],
        'business_from_id': [
            { type: 'required', message: 'Required.' },
            { type: 'isDuplicate', message: 'Business from already exist.'}  
        ],
        'business_to_id': [
            { type: 'required', message: 'Required.' },
            { type: 'isDuplicate', message: 'Business to already exist.'}  
        ],
    };

    DetailValidationMessage = {
        'product_id': [{ type: 'required', message: 'Required.' },],
        'stock_qty': [{ type: 'required', message: 'Required.' },],
        'gross_weight': [{ type: 'required', message: 'Required.' },],
        'purity_id': [{ type: 'required', message: 'Required.' },],
        'other_weight': [{ type: 'required', message: 'Required.' },],
        'net_weight': [{ type: 'required', message: 'Required.' },],
        'product_variants_id': [{ type: 'required', message: 'Required.' },],
        'combination': [{ type: 'required', message: 'Required.' },],
        'mixed_material': [{ type: 'required', message: 'Required.' },],
        'notes': [{ type: 'required', message: 'Required.' },],
        'melting': [{ type: 'required', message: 'Required.' },],
        // 'wastage': [{ type: 'required', message: 'Required.' },],
        'fine_weight': [{ type: 'required', message: 'Required.' },],
    }

    async GetPurchaseReceiptById() {
        this.helper.ShowSpinner();        
        const res = await this.service.GetById(this.PurchaseReceiptId, `v1/StockEntry/StockEntry`);
        this.purchaseReceiptForm.patchValue(res);        
        this.helper.HideSpinner();
    }

    async GetEmployeeList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll('v1/Employee/List');
        if (res?.length > 0) {
            for (const obj of res) {
                obj["name"] = obj.first_name + " " + obj?.last_name;
            }
            this.EmployeeList = res;
        }
        else {
            this.EmployeeList = [];
        }
        this.helper.HideSpinner();
    }

    async GetMetalList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll('v1/Metal/List');
        if (res?.length > 0) {
            this.MetalList = res;
            // if (this.PurchaseReceiptId != 0) {
            //     await this.GetPurityList(this.PurchaseReceiptData.metal_id);
            // }
        }
        else {
            this.MetalList = [];
        }
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
        if (res?.length > 0) {
            this.BusinessList = res;
        }
        else {
            this.BusinessList = [];
        }
        this.helper.HideSpinner();
    }

    BusinessValidation($event) {
        const business_from_id = this.PurchaseReceiptData.business_from_id;
        const business_to_id = $event;
        if (business_from_id == business_to_id) {
            this.PurchaseReceiptData.business_to_id = null;
            this.helper.ErrorToastr("From and to, business should not be same");
        }
    }

    async SaveOrUpdatePurchase() {
        if(this.purchaseReceiptForm.invalid) {
            this.purchaseReceiptForm.markAllAsTouched();
            return;
        }        
        this.helper.ShowSpinner();
        let res: any;            
        if (this.PurchaseReceiptId == 0) {
            res = await this.service.CommonPost(this.purchaseReceiptForm.value, 'v1/StockEntry/Insert');
        }
        else {
            res = await this.service.CommonPut(this.purchaseReceiptForm.value, `v1/StockEntry/Update/${this.PurchaseReceiptId}`);
        }
        if (res.Type == "S") {            
            this.helper.SucessToastr(res.Message);
            this.PurchaseReceiptId = res.AddtionalData;
            this.router.navigateByUrl(`/`, {skipLocationChange: true}).then(
                () => this.router.navigate([`/PurchaseIssue/${res.AddtionalData}`])
            );
        }
        else {            
            this.helper.ErrorToastr(res.Message);
        }
        this.helper.HideSpinner();
    }

    async GetPurchaseReceiptDetailList() {
        this.helper.ShowSpinner();
        const res = await this.service.GetAll(`v1/StockEntryDetail/StockEntryDetailList/${this.PurchaseReceiptId}`);
        if (res?.length > 0) {
            this.PurchaseReceiptDetailList = res;
        } else {
            this.PurchaseReceiptDetailList = [];
        }
        this.helper.HideSpinner();
    }

    async AddDetailProduct(id) {
        this.helper.ShowSpinner();
        this.PurchaseDetailId = id;
        await this.getProductList();                
        if (id == 0) {
            // this.PurchaseReceiptDetailData = new PurchaseDetailModel();
            // this.ProductVariantList = [];
            
            const stockId = this.purchaseReceiptForm.get('id').value;
            this.PurchaseReceiptDetailForm.get('stock_entry_id').setValue(stockId);
            this.PurchaseReceiptDetailForm.get('mc_amount').setValue(0);
        } else {            
            const res = await this.service.GetAll(`v1/StockEntryDetail/StockEntryDetailById/${id}`);
            let stockDetailValue = res[0];
            stockDetailValue.mixed_material =  stockDetailValue.mixed_material ? JSON.parse(stockDetailValue.mixed_material) : null;
            this.PurchaseReceiptDetailData.fine_weight = stockDetailValue.fine_weight;
            const notesControl = this.PurchaseReceiptDetailForm.get('notes');
            notesControl.setValidators([Validators.required]);
            notesControl.updateValueAndValidity();    
            await this.bindValueToForm(stockDetailValue);            
        }        
        this.PurchaseDialouge = true;
        this.helper.HideSpinner();
    }

    GetCategoryList() {
        this.helper.ShowSpinner();
        const res = Array.from(new Set(this.DetailList.map(o => o.category_name))).map(category_name => ({ name: category_name }));
        this.CategoryDropdown = res;
        this.GetProductList();
        this.helper.HideSpinner();
    }

    GetProductList() {
        this.helper.ShowSpinner();
        this.ProductList = this.DetailList;
        this.helper.HideSpinner();
    }

    async GetVariantByProduct($event) {
        this.helper.ShowSpinner();
        const Product_id = $event;
        this.PurchaseReceiptDetailData.product_id = Product_id;
        let res = await this.service.GetAll(`v1/StockEntryDetail/StockVarientList/${Product_id}`);
        if (res?.length > 0) {
            const VariantValidation = this.PurchaseReceiptDetailForm.get('product_variants_id');
            VariantValidation.setValidators([Validators.required]);
            VariantValidation.updateValueAndValidity();
            // Combination
            const CombinationValidation = this.PurchaseReceiptDetailForm.get('combination');
            CombinationValidation.setValidators([Validators.required]);
            CombinationValidation.updateValueAndValidity();
            this.ProductVariantList = res;
        }
        else {
            const VariantValidation = this.PurchaseReceiptDetailForm.get('product_variants_id');
            VariantValidation.setValidators([Validators.nullValidator]);
            VariantValidation.updateValueAndValidity();
            // Combination
            const CombinationValidation = this.PurchaseReceiptDetailForm.get('combination');
            CombinationValidation.setValidators([Validators.nullValidator]);
            CombinationValidation.updateValueAndValidity();
            this.ProductVariantList = [];
        }
        await this.GetMixedMaterialList(Product_id);
        this.helper.HideSpinner();
    }

    async GetMixedMaterialList(product_id) {
        this.helper.ShowSpinner();
        const res = await this.service.GetAll(`v1/StockEntryDetail/StockMixedMaterialList/${product_id}`);
        if (res?.length > 0) {
            this.MixedMaterialList = res;
            const MixedMaterialValidation = this.PurchaseReceiptDetailForm.get('mixed_material');
            MixedMaterialValidation.setValidators([Validators.nullValidator]);
            MixedMaterialValidation.updateValueAndValidity();
        } else {
            this.MixedMaterialList = [];
        }
        this.helper.HideSpinner();
    }

    GetProductVariantCombination($event) {
        this.helper.ShowSpinner();
        this.selectedVariantCombination = this.ProductVariantList.filter(o => o.id == $event)[0];
        this.helper.HideSpinner();
    }

    GetNettWeight(other_weight) {
        this.PurchaseReceiptDetailData.net_weight = this.PurchaseReceiptDetailData.gross_weight - other_weight;
    }

    GetFineWeight($event)
    {
        this.PurchaseReceiptDetailForm.value.net_weight = this.PurchaseReceiptDetailForm.value.other_weight;
        if(this.PurchaseReceiptDetailForm.value.gross_weight != null)
        {
            this.PurchaseReceiptDetailForm.get('net_weight').setValue(this.PurchaseReceiptDetailForm.value.gross_weight);
            const wastege_value = $event;
            if(wastege_value != "" && wastege_value != null)
            {
                const TotalMeltingAndWastage = Number(this.PurchaseReceiptDetailForm.value.melting) + Number(wastege_value);
                const OverAllValue = Number(this.PurchaseReceiptDetailForm.value.net_weight - this.PurchaseReceiptDetailForm.value.other_weight) * Number(TotalMeltingAndWastage);
                this.PurchaseReceiptDetailForm.value.fine_weight = OverAllValue / 100;
                this.PurchaseReceiptDetailData.fine_weight = this.PurchaseReceiptDetailForm.value.fine_weight;
            }
            else
            {
                if(this.PurchaseReceiptDetailForm.value.wastage == null || this.PurchaseReceiptDetailForm.value.wastage == "")
                {
                    const melting_value = Number(this.PurchaseReceiptDetailForm.value.melting);
                    const MeltingAndWastageValue = Number(melting_value) + Number(this.PurchaseReceiptDetailForm.value.wastage ?? 0.00);
                    const OverAllValue = Number(this.PurchaseReceiptDetailForm.value.net_weight - this.PurchaseReceiptDetailForm.value.other_weight) * MeltingAndWastageValue;
                    this.PurchaseReceiptDetailForm.value.fine_weight = OverAllValue / 100;
                    this.PurchaseReceiptDetailData.fine_weight = this.PurchaseReceiptDetailForm.value.fine_weight;
                }
                   
            }
            if(wastege_value == 0)
            {
                this.PurchaseReceiptDetailForm.get('fine_weight').setValue(this.PurchaseReceiptDetailForm.value.net_weight);
            }
        }
        else
        {
            if(this.PurchaseReceiptDetailForm.value.gross_weight != null)
            {
                this.PurchaseReceiptDetailForm.value.net_weight.setValue(this.PurchaseReceiptDetailForm.value.gross_weight - this.PurchaseReceiptDetailForm.value.other_weight);
                const MeltingAndWastage = Number(this.PurchaseReceiptDetailForm.value.melting) + Number(this.PurchaseReceiptDetailForm.value.wastage);
                const OverAllValue = Number(this.PurchaseReceiptDetailForm.value.net_weight) * MeltingAndWastage;
                this.PurchaseReceiptDetailForm.value.fine_weight = OverAllValue / 100;
                this.PurchaseReceiptDetailData.fine_weight = this.PurchaseReceiptDetailForm.value.fine_weight;
            }
        }
    }

    GetFineWeightByMelting($event)
    {
        this.PurchaseReceiptDetailForm.value.wastage;
        if(this.PurchaseReceiptDetailForm.value.wastage == "")
        {
            this.PurchaseReceiptDetailForm.value.wastage = 0.00;
            const melting_value = $event;
            const MeltingAndWastageValue = melting_value + this.PurchaseReceiptDetailForm.value.wastage;
            const OverAllValue = this.PurchaseReceiptDetailForm.value.net_weight * MeltingAndWastageValue;
            this.PurchaseReceiptDetailForm.value.fine_weight = OverAllValue / 100;
            this.PurchaseReceiptDetailData.fine_weight = this.PurchaseReceiptDetailForm.value.fine_weight;
        }
        else
        {
            const melting_value = $event;
            const MeltingAndWastageValue = Number(melting_value) + Number(this.PurchaseReceiptDetailForm.value.wastage);
            const OverAllValue = Number(this.PurchaseReceiptDetailForm.value.net_weight) * MeltingAndWastageValue;
            this.PurchaseReceiptDetailForm.value.fine_weight = OverAllValue / 100;
            this.PurchaseReceiptDetailData.fine_weight = this.PurchaseReceiptDetailForm.value.fine_weight;
        }
    }

    async SaveOrUpdatePurchaseDetail() {
        this.purchaseReceiptForm.value.stock_entry_date_time = this.PurchaseReceiptData.stock_entry_date_time.toString();
        if(this.PurchaseReceiptDetailForm.invalid) {
            this.PurchaseReceiptDetailForm.markAllAsTouched();
            return;
        }
        this.helper.ShowSpinner();
        const value = this.PurchaseReceiptDetailForm.value;
        delete value.product_variants_id_proxy;
        delete value.category_id;
        let res;
        if(this.PurchaseReceiptDetailForm.value.melting == "")
        {
            this.PurchaseReceiptDetailForm.value.melting = 0.00;
        }
        if(this.PurchaseReceiptDetailForm.value.wastage == "")
        {
            this.PurchaseReceiptDetailForm.value.wastage = 0.00;
        }
        if(value.id) {
            res = await this.service.CommonPut(value, `v1/StockEntryDetail/Update/${value.id}`);
        } else {
            res = await this.service.CommonPost(value, 'v1/StockEntryDetail/Insert');
        }
        if (res.Type == "S") {
            this.helper.HideSpinner();
            this.PurchaseDialouge = false;
            this.resetPurchaseReceiptDetailForm();
            await this.GetPurchaseReceiptDetailList();
        }
        else
        {
            this.helper.HideSpinner();
            this.helper.ErrorToastr(res.Message);
        }
        this.helper.HideSpinner();
    }

    async DeletePurchaseDetail(id) {
        this.confirmationService.confirm({
            message: 'Are you sure, that you want to delete - ?',
            icon: 'pi pi-question-circle',
            accept: async () => {
                this.helper.ShowSpinner();
                let res = await this.service.Delete(`v1/StockEntryDetail/Delete/${id}`);
                if (res.Type == "S") {
                    this.helper.SucessToastr(res.Message);
                    await this.GetPurchaseReceiptDetailList
                }
                else {
                    this.helper.ErrorToastr(res.Message);
                }
                this.helper.HideSpinner();
            }
        });
    }

    Cancel() {
        this.helper.redirectTo('/PurchaseIssueList');
    }

    CancelDetailPopup() {        
        this.PurchaseDialouge = false;
        this.PurchaseReceiptDetailForm.reset();
    }

    hasDuplicateEmployee(handOver:string, received: string, businessFrom: string, businessTo: string) {
        // 'hand_over_id', 'received_by_id', 'business_from_id', 'business_to_id'  
        console.log('Muthu')
        return (group:AbstractControl) : AbstractControl => {  
            console.log(group)          
            const receivedControl = group.get(received);
            const handOverControl = group.get(handOver);
            const businessFromControl = group.get(businessFrom);
            const businessToControl = group.get(businessTo);
            if(!handOverControl.value) {
                handOverControl.setErrors({required: true})
            } else if(handOverControl.value === receivedControl.value) {
                handOverControl.setErrors({isDuplicate: true})
            } else {
                handOverControl.setErrors(null)
            }

            if(!businessToControl.value) {
                businessToControl.setErrors({required: true})
            } else if(businessFromControl.value === businessToControl.value) {
                businessToControl.setErrors({isDuplicate: true})
            } else {
                businessToControl.setErrors(null)
            }
            console.log(businessToControl, handOverControl)
            return null
        }
    }

    async getProductList() {
        this.stockProductList = await this.service.CommonPost({ id: this.purchaseReceiptFc.id.value, metal_id: this.purchaseReceiptFc.metal_id.value, purity_id: this.purchaseReceiptFc.purity_id.value }, 'v1/StockEntryDetail/StockProductList');
        this.stockProductList.length && await this.getCategoryList(this.stockProductList);
    }

    async getCategoryList(productList: any[]) {    
        const categoryList: any[] = [];
        await productList.reduce((accumulator, currentValue) => {      
          const categoryItem = {name: '', id: ''}
          if(!accumulator.includes(currentValue.category_id)) {
            categoryItem.name = currentValue.category_name;
            categoryItem.id = currentValue.category_id;
            categoryList.push(categoryItem);
            accumulator.push(currentValue.category_id);
            return accumulator;
          }
          return accumulator;
        }, []);
        this.CategoryDropdown = categoryList;
        console.log('Category List', this.CategoryDropdown);
      }

    categoryChange(eve: any) {
        this.productList = this.stockProductList.filter(product => product.category_id === eve.value);
        this.PurchaseReceiptDetailForm.get('product_id').setValue('');
        // this.PurchaseReceiptDetailForm.get('product_id_proxy').setValue('');
        this.PurchaseReceiptDetailForm.get('product_variants_id').setValue(null);
        this.PurchaseReceiptDetailForm.get('product_variants_id_proxy').setValue('');   
        this.PurchaseReceiptDetailForm.get('combination').setValue('');
        // this.PurchaseReceiptDetailForm.get('unit_name').setValue(''); 
        this.variantList = [];
        this.mixedMaterialFA.clear();
    }

    async productChange(eve: any) {       
        this.mixedMaterialFA.clear();            
        const productVariantIdControl = this.PurchaseReceiptDetailForm.get('product_variants_id');      
        const productVariantProxyControl = this.PurchaseReceiptDetailForm.get('product_variants_id_proxy');      
        const combinationControl = this.PurchaseReceiptDetailForm.get('combination');
        // const qtyControl = this.PurchaseReceiptDetailForm.get('stock_qty'); 
        productVariantIdControl.setValue(null);        
        productVariantProxyControl.setValue(null);        
        combinationControl.setValue('');
        const value = eve.value;       
        const mixedMaterialList =  await this.getMixedMaterialList(eve.value);
        this.variantList = await this.getProductVariantList(eve.value);
        if(this.variantList?.length) {
            productVariantProxyControl.setValidators([Validators.required]);               
            productVariantIdControl.setValidators([Validators.required]);               
            combinationControl.setValidators([Validators.required]);
        //   qtyControl.setValidators([Validators.required]);          
        } else {      
            productVariantProxyControl.setValidators([Validators.nullValidator]);          
            productVariantIdControl.setValidators([Validators.nullValidator]);          
            combinationControl.setValidators([Validators.nullValidator]);
        //   qtyControl.setValidators([Validators.required, Validators.max(value.stock)]);          
        }    
        productVariantProxyControl.updateValueAndValidity();
        productVariantIdControl.updateValueAndValidity();
        combinationControl.updateValueAndValidity();        
        // qtyControl.updateValueAndValidity();        
        mixedMaterialList.forEach((mixMaterial) => {
          this.addMixedMaterialFG(mixMaterial);
        });        
    }

    async variantChange(eve: any) {        
        const value = eve.value;    
        const variantIdControl = this.PurchaseReceiptDetailForm.get('product_variants_id');
        const combinationControl = this.PurchaseReceiptDetailForm.get('combination');         
        // variantIdControl.setValue('');
        variantIdControl.setValue(value.id);
        combinationControl.setValue(value.combination);        
        variantIdControl.markAsTouched();
        combinationControl.markAsTouched();
        variantIdControl.updateValueAndValidity();      
        combinationControl.updateValueAndValidity();      
    }

    async getProductVariantList(id: string) {
        let res = await this.service.GetAll(`v1/StockEntryDetail/StockVarientList/${id}`);
        return res;
    }

    async getMixedMaterialList(id) {
        const res = await this.service.GetAll(`v1/StockEntryDetail/StockMixedMaterialList/${id}`);
        return res
    }

    addMixedMaterialFG(mixMaterial: any) {
        const mixMaterialFG: FormGroup = this.fb.group({
          mixed_material_id: ['', Validators.required],
          weight: [''],
          amount: [''],
          material_name: [{value: '', disabled: true }]
        });

        mixMaterialFG.patchValue(mixMaterial);
        mixMaterialFG.get('mixed_material_id').setValue(mixMaterial.id)
        // console.log(mixMaterialFG)
        this.mixedMaterialFA.push(mixMaterialFG);
      }

    async calculateNetWeight(grossWeight, mixMaterialValue) {
        let mixMaterialWeight = await mixMaterialValue.reduce((accumulator, currentValue) => +accumulator + (currentValue.weight ? +currentValue.weight : 0),0);
        this.PurchaseReceiptDetailForm.get('net_weight').setValue(+grossWeight - mixMaterialWeight);
        this.PurchaseReceiptDetailForm.get('other_weight').setValue(mixMaterialWeight);
        if(this.PurchaseReceiptDetailForm.value.gross_weight != "")
        {
           const net_weight = this.PurchaseReceiptDetailForm.value.gross_weight - this.PurchaseReceiptDetailForm.value.other_weight;
           this.PurchaseReceiptDetailForm.get('net_weight').setValue(net_weight); 
        }
        if(this.PurchaseReceiptDetailForm.value.melting == "" && this.PurchaseReceiptDetailForm.value.wastage == "")
        {
            this.PurchaseReceiptDetailForm.get('fine_weight').setValue(this.PurchaseReceiptDetailForm.value.net_weight);
        }
        else
        {
            const MeltingAndWastage = Number(this.PurchaseReceiptDetailForm.value.melting) + Number(this.PurchaseReceiptDetailForm.value.wastage);
            const OverAllValue = Number(this.PurchaseReceiptDetailForm.value.net_weight) * MeltingAndWastage;
            this.PurchaseReceiptDetailForm.get('fine_weight').setValue(OverAllValue / 100);
        }
    }

    async bindValueToForm(val: any) {                
        const selectedProduct = this.stockProductList.find(product => product.id == val.product_id);
        this.PurchaseReceiptDetailForm.get('category_id').setValue(selectedProduct?.category_id);
        await this.categoryChange({value: selectedProduct?.category_id});
        await this.productChange({value: val.product_id});
        if(val.product_variants_id) {
            const selectedVariant = await this.variantList.find(variant => variant.id === val.product_variants_id);    
            this.PurchaseReceiptDetailForm.get('product_variants_id_proxy').setValue(selectedVariant);
            await this.variantChange({value: selectedVariant}); 
        }

        if(val.history) {
            const history = JSON.parse(val.history);
            this.PurchaseReceiptDetailForm.get('notes').setValue(history[0].notes);
        }
            
        this.PurchaseReceiptDetailForm.patchValue(val);    
    }

    resetPurchaseReceiptDetailForm() {
        this.mixedMaterialFA.clear();
        this.PurchaseReceiptDetailForm.get('product_variants_id').removeValidators(Validators.required);      
        this.PurchaseReceiptDetailForm.get('product_variants_id_proxy').removeValidators(Validators.required);      
        this.PurchaseReceiptDetailForm.get('combination').removeValidators(Validators.required);
        this.PurchaseReceiptDetailForm.get('notes').removeValidators(Validators.required);
        this.PurchaseReceiptDetailForm.markAsUntouched();
        this.PurchaseReceiptDetailForm.reset();
        
        // this.PurchaseReceiptDetailForm.markAsPristine();
    }

    parseString(string: string) {        
        return typeof string === 'string' ?  JSON.parse(string) : '';        
    }

}

const routes: Routes = [
    { path: "", component: PurchaseIssueComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PurchaseIssueRoutingModule { }

@NgModule({
    declarations: [PurchaseIssueComponent],
    imports: [
        CommonModule,
        PurchaseIssueRoutingModule,
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
    ],
})
export class PurchaseIssueModule { }