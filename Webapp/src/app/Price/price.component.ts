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
import { PriceModel } from 'src/Model/Price.model';
import { CalendarModule } from 'primeng/calendar';


@Component({
    selector: 'app-price',
    templateUrl: './price.component.html',
    providers: [ConfirmationService]
})

export class PriceComponent implements OnInit {

    PriceData : PriceModel = new PriceModel;
    PriceList : any = [];
    MetalDropdown : any = [];
    PurityDropdown : any = [];
    PriceForm : FormGroup;
    PriceId: number = 0;
    CurrencySymbol : string = "";

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
        await this.GetMetalList();
        await this.GetPriceList()
        this.CurrencySymbol = this.helper.GetDefaultCurrency();
        this.helper.HideSpinner();
    }

    FormValidation(){
        this.PriceForm = this.formbuilder.group({
            metal_id: new FormControl('', Validators.compose([Validators.required])),
            purity_id: new FormControl('', Validators.compose([Validators.required])),
            price: new FormControl('', Validators.compose([Validators.required])),
            date_time: new FormControl('', Validators.compose([Validators.required])),
        });
    }

    PriceValidationMessage = {
        'category_id': [{ type: 'required', message: 'Required.' },],
        'metal_id': [{ type: 'required', message: 'Required.' },],
        'price': [{ type: 'required', message: 'Required.' },],
        'date_time': [{ type: 'required', message: 'Required.' },],
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
            if(this.PurityDropdown.length > 0){
                this.PriceData.purity_id = this.PurityDropdown[0].id;
            }
        }
        else
        {
            this.PurityDropdown = [];
        }
        this.helper.HideSpinner();
    }

    async GetPriceList()
    {
            this.helper.ShowSpinner();
            let res = await this.service.GetAll("v1/Price/List");          
            if(res)         
            {
                this.PriceList = res;
            }
            else
            {
                this.PriceList = [];
            }
        this.helper.HideSpinner();
    }

    async SaveOrUpdate() {
         
        if (this.PriceForm.valid) {
            this.helper.ShowSpinner();
            let res: any;
            // if (this.PriceData.id) {
            //     res = await this.service.CommonPut(this.PriceData, `v1/Metal/Update/${this.PriceData.id}`);  
            // } else {
                res = await this.service.CommonPost(this.PriceData, "v1/Price/Insert"); 
            // }
            if (res.Type == "S") {
                this.helper.SucessToastr(res.Message);
                this.helper.redirectTo("/Price");
                this.FormValidation();                
                await this.GetPriceList();
                this.Cancel();
            } else {

                this.helper.ErrorToastr(res.Message);
            }
            this.helper.HideSpinner();
        }
        else {
            this.helper.validateAllFormFields(this.PriceForm)
            this.helper.HideSpinner();
        }
   
    }
   

    Cancel() {
        this.helper.ShowSpinner();
        this.PriceId = 0;
        this.PriceData = new PriceModel();
        this.helper.redirectTo("Price");
        this.helper.HideSpinner();
    }
}

const routes: Routes = [
    { path: "", component: PriceComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PriceRoutingModule { }

@NgModule({
    declarations: [PriceComponent],
    imports: [
        CommonModule,
        PriceRoutingModule,
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
        DropdownModule,
        CalendarModule
    ],
})
export class PriceModule { }
