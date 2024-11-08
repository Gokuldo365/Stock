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
    selector: 'app-,stock-report',
    templateUrl: './stock-report.component.html',
    providers: [ConfirmationService]
})

export class StockReportComponent implements OnInit {
    CategoryDropdown : any = [];
    MetalDropdown : any = [];
    PurityDropdown : any = [];
    item_name_code : any = [];
    SearchData : any = {};
    StockReportList : any = [];

    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService

    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        await this.GetMetalList();
        await this.GetStockReportList()
        this.helper.HideSpinner();
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
        }
        else
        {
            this.CategoryDropdown = [];
        }
        this.helper.HideSpinner();
    }

    async GetStockReportList()
    {
        this.helper.ShowSpinner();
        let res = await this.service.CommonPost(this.SearchData,'v1/StockReport/StockReportFilterList');
        if(res?.length > 0)
        {
            this.StockReportList = res;
        }
        else
        {
            this.StockReportList = [];
        }
        this.helper.HideSpinner();
    }

   

}

const routes: Routes = [
    { path: "", component: StockReportComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StockReportRoutingModule { }

@NgModule({
    declarations: [StockReportComponent],
    imports: [
        CommonModule,
        StockReportRoutingModule,
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
export class StockReportModule { }
