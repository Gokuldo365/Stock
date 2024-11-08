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
import { CalendarModule } from 'primeng/calendar';
import { StickyPageHeaderComponent } from "src/app/Shared/sticky-page-header/sticky-page-header.component";
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-stock-inward',
    templateUrl: './stock-inward-list.component.html',
    providers: [ConfirmationService]
})

export class StockInwardListComponent implements OnInit {

    headerPinned : boolean = false;
    InwardList : any = [];
    
    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService

    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        await this.GetInwardList();
        this.helper.HideSpinner();
    }

    async AddOrEditInward(Inward_id : number)
    {
        this.helper.redirectTo(`StockInward/${Inward_id}`);
    }

    async GetInwardList()
    {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll('v1/StockEntry/StockEntryList');
        console.log(res)
        if(res?.length > 0)
        {
            this.InwardList = res;
        }
        else
        {
            this.InwardList = [];
        }
        this.helper.HideSpinner();
    }

}

const routes: Routes = [
    { path: "", component: StockInwardListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StockInwardListRoutingModule { }

@NgModule({
    declarations: [StockInwardListComponent],
    imports: [
        CommonModule,
        StockInwardListRoutingModule,
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
        DropdownModule
    ],
})
export class StockInwardListModule { }
