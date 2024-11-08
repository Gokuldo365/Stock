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
import { $ } from 'protractor';
import { MTemplateDirective } from 'src/Directives/template.directive';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OutwardStockProductFormComponent } from '../outward-stock-product-form/outward-stock-product-form.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
    selector: 'app-stock-outward-form',
    templateUrl: './stock-outward-form.component.html',
    providers: [ConfirmationService]
})

export class StockOutWardFormComponent implements OnInit {
    headerPinned: boolean = false;
    outwardForm : FormGroup = this.formbuilder.group({
        id: [''],
        stock_number: [''],
        status: [''],
        stock_entry_type: ['Outward'],        
        stock_entry_date_time: [new Date(), Validators.required],
        hand_over_id: ['', Validators.required],
        received_by_id: ['', Validators.required],
        metal_id: ['', Validators.required],
        purity_id: ['', Validators.required],        
        note: [''],
    }, { validator: this.handOverAndIssueValidation });

    outwardInfoId: number | string;
    outWardInfo: any = {};
    employeeList: any[] = [];
    purityList: any[] = [];
    purityListByMetal: any[] = [];
    metalList: any[] = [];
    outwardProductList: any[] = [];
    stockProductTotalWeightDetail: any = {};
    
    get outwardFC() {
        return this.outwardForm.controls;
    }

    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService,
        private router: Router,
        public dialogService: DialogService

    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        this.outwardInfoId = this.route.snapshot.params["outward_id"];
        this.outwardInfoId != 0 && await this.getOutwardInfo();    
        this.outwardInfoId != 0 && await this.getStockProductList();    
        await this.getMetalList();        
        await this.getEmployeeList();        
        this.helper.HideSpinner();
    }

    async getOutwardInfo() {
        this.helper.ShowSpinner();        
        const res = await this.service.GetAll(`v1/StockEntry/StockEntry/${this.outwardInfoId}`);
        this.outWardInfo = res;
        this.outwardForm.patchValue(this.outWardInfo);        
        this.helper.HideSpinner();
    }

    async getEmployeeList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll('v1/Employee/List');
        if(res?.length > 0) {
            this.employeeList = res;
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

    async getMetalList() {
        this.helper.ShowSpinner();
        const res = await this.service.GetAll('v1/Metal/List');
        if(res?.length > 0) {
            this.metalList = res;
            await this.getPurityList();
            if( this.outwardInfoId != 0) {
                await this.metalChange({value: this.outwardFC.metal_id.value});
                this.outwardForm.patchValue(this.outWardInfo);
            }
        }       
        this.helper.HideSpinner();
    }

    async saveOrUpdateOutward() {
        if(this.outwardForm.invalid) {
            this.outwardForm.markAllAsTouched();
            return;
        }
        this.helper.ShowSpinner();
        const res = await this.service.CommonPost(this.outwardForm.value,'v1/StockEntry/Insert');
        if(res.Type == "S") {            
            this.helper.SucessToastr(res.Message);
            if( res?.AddtionalData) {                 
                this.router.navigateByUrl(`/`, {skipLocationChange: true}).then(
                    ()=>this.router.navigate([`/StockOutWard/${res.AddtionalData}`])
                );                
            }                
        } else {           
            this.helper.ErrorToastr(res.Message);
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

    metalChange(eve: DropdownChangeEvent | any) {
        console.log(eve)
        const metalId = eve.value;
        this.outwardForm.get('purity_id').setValue('');
        this.purityListByMetal = this.purityList.filter(purity => purity.metal_id == metalId)
    }

    openOutwardProductForm(isEdit: boolean, product: any) {
        const stockProducts  = this.outwardProductList.reduce((acc, pro)=>{
            (isEdit && product.product_id === pro.product_id) || acc.productIds.push(pro.product_id);
            (isEdit && product.product_variants_id === pro.product_variants_id) || acc.variantIds.push(pro.product_variants_id);            
            return acc;
        }, {productIds: [], variantIds: []});
        const ref: DynamicDialogRef = this.dialogService.open(OutwardStockProductFormComponent, { 
            data: {isEdit: isEdit,  stockInfo: this.outwardForm.value, product: product, stockProducts: stockProducts},
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

    async getStockProductList() {        
        const res = await this.service.GetById(this.outwardForm.value.id,'v1/StockEntryDetail/StockEntryDetailList');        
        this.outwardProductList = res;
        this.stockProductTotalWeightDetail = this.outwardProductList.reduce((acc, product)=>{
            return {
                qty: +(product.stock_qty*-1) + acc.qty,
                netWt: +product.net_weight + acc.netWt,
                otherWt: +product.other_weight + acc.otherWt,
                grossWt: +product.gross_weight + acc.grossWt
            }
        }, {qty: 0, netWt: 0, otherWt: 0, grossWt: 0});
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

}

const routes: Routes = [
    { path: "", component: StockOutWardFormComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StockOutWardFormRoutingModule { }

@NgModule({
    declarations: [StockOutWardFormComponent],
    imports: [
        CommonModule,
        StockOutWardFormRoutingModule,
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
        MTemplateDirective,
        KeyFilterModule,
        ConfirmDialogModule,
        InputNumberModule,
        CalendarModule,
        DropdownModule,
        DialogModule,
        OverlayPanelModule,
    ],
    providers: [
        DialogService,
        ConfirmationService
    ],
})
export class StockOutWardFormModule { }
