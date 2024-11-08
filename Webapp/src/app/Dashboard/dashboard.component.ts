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
import { CountryModel } from 'src/Model/Country.model';
import { StickyPageHeaderComponent } from "src/app/Shared/sticky-page-header/sticky-page-header.component";
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from 'primeng/multiselect';
import { BadgeModule } from 'primeng/badge';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
interface Metal {
    metal_name: string;
    purity_code: string;
    stock_weight: string;
    purity: string;
    fine_weight: string;
}
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    providers: [ConfirmationService]
})



export class DashboardComponent implements OnInit {
    DashboardData: any = [];
    MetalList: any = [];
    MetalStockList: any = [];
    selectedMetals: any = [];
    LastTenTranscationList: any = [];

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
        await this.GetMetalStockList([]);
        await this.GetLastTenTranscationList();
        this.helper.HideSpinner();
    }

    async GetMetalList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll('v1/Metal/List');
        if (res.length > 0) {
            this.MetalList = res;
        }
        this.helper.HideSpinner();
    }

    async GetMetalStockList(metailId) {
        this.helper.ShowSpinner();
        let res = await this.service.CommonPost({ metal_id: metailId }, 'v1/StockReport/MetalStockList');
        if (res.length > 0) {
            const metalGroups = res.reduce((acc, item) => {
                if (!acc[item.metal_name]) {
                    acc[item.metal_name] = [];
                }
                acc[item.metal_name].push(item);
                return acc;
            }, {} as { [key: string]: Metal[] });
            this.MetalStockList = metalGroups;
            this.getMetalKeys();
        }
        this.helper.HideSpinner();
    }


    getMetalKeys() {
        // console.log(Object.keys(this.MetalStockList));
        return Object.keys(this.MetalStockList);
    }

    FineWeightTotal(metal) {
        const Tax = this.MetalStockList[metal].reduce((total, item) => {
            return total + (item.fine_weight - 0);
        }, 0);
        return Tax.toFixed(3);
    }

    async GetLastTenTranscationList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/StockReport/LastTenTransactionList");
        if (res.length > 0) {
            for(let obj of res){
if(obj.mixed_material){
    obj.mixed_material = JSON.parse(obj.mixed_material);

}
            }
            this.LastTenTranscationList = res;
        }
        this.helper.HideSpinner();
    }

    ListRouting(stock_entry_type: string, stock_entry_id: string){
        if(stock_entry_type == "Receipt"){
            this.helper.redirectTo("/Receipt/" + stock_entry_id + "/D");
        }
        else{
            this.helper.redirectTo("/Issue/" + stock_entry_id + "/D");
        }
    }

    
}

const routes: Routes = [
    { path: "", component: DashboardComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }

@NgModule({
    declarations: [DashboardComponent],
    imports: [
        CommonModule,
        DashboardRoutingModule,
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
        DropdownModule,
        MultiSelectModule,
        BadgeModule,
        OverlayPanelModule,
        InputGroupModule,
        InputGroupAddonModule,

    ],
})
export class DashboardModule { }
