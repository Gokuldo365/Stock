import { Component, OnInit, NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { ModuleData } from 'src/Helper/Modules';
import { CommonHelper } from 'src/Helper/CommonHelper';
import { CommonService } from 'src/Service/Common.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { BadgeModule } from 'primeng/badge';
import { MTemplateDirective } from 'src/Directives/template.directive';
import { StickyPageHeaderComponent } from 'src/app/Shared/sticky-page-header/sticky-page-header.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import * as moment from 'moment';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-purchase-receipt-list',
    templateUrl: './purchase-receipt-list.component.html',  
    providers: [ConfirmationService]
})

export class PurchaseReceiptListComponent implements OnInit {

    PurchaseReceiptList : any = [];
    headerPinned: boolean = false;
    SearchData : any = {};
    MetalList : any = [];
    PurityList : any = [];
    maxDate = moment();
    ranges: any;
    datePickerLocalOptions: any = {
    format: 'YYYY-MM-DD',
    displayFormat: 'DD-MMM-YYYY',
    direction: 'ltr',
    weekLabel: 'W',
    separator: ' To ',
    cancelLabel: 'Cancel',
    applyLabel: 'Ok',
    clearLabel: 'Clear',
    customRangeLabel: 'Custom Range',
  }
    
    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
        private confirmationService: ConfirmationService,
        private datePipe: DatePipe

    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        await this.GetMetalList();
        await this.GetStockEntryList();
        this.helper.HideSpinner();
    }

    setRangesToCalender() {
        this.ranges = {
          'Today': [moment(), moment()],
          'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
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
        const res = await this.service.GetAll('v1/Purity/List');
        if(res?.length > 0)
        {
            this.PurityList = res.filter(o=> o.metal_id == $event);
        }
        else
        {
            this.MetalList = [];
        }
        this.helper.HideSpinner();
    }

    async GetDateRange($event)
    {
        this.SearchData.date_from = this.datePipe.transform($event.from.$d, 'yyyy-MM-dd hh:mm');
        this.SearchData.date_to = this.datePipe.transform($event.to.$d, 'yyyy-MM-dd hh:mm');
    }

    async GetStockEntryList()
    {
        this.helper.ShowSpinner();
        const res = await this.service.CommonPost(this.SearchData, 'v1/StockEntry/StockEntryList');
        if(res?.length > 0)
        {
            this.PurchaseReceiptList = res.filter(o=> o?.stock_entry_type == "PurchaseReceipt");
        }
        else
        {
            this.PurchaseReceiptList = [];
        }
        this.helper.HideSpinner();
    }
    

    AddOrEditPurchase(purchase_id : any) {
        this.helper.redirectTo(`PurchaseReceipt/${purchase_id}`);
    }

    async Delete(id: number, name: string) {
        this.confirmationService.confirm({
          message: 'Are you sure, that you want to delete - ' + name + '?',
          icon: 'pi pi-question-circle',
          accept: async () => {
            this.helper.ShowSpinner();
            let res = await this.service.Delete(`v1/Product/Delete/${id}`);    
            if (res.Type == "S") {
              this.helper.SucessToastr(res.Message);
            //   await this.GetPurchaseReceiptList();
            }
            else {
              this.helper.ErrorToastr(res.Message);
            }
            this.helper.HideSpinner();
          }
        });
      }

}

const routes: Routes = [
    { path: "", component: PurchaseReceiptListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PurchaseReceiptListRoutingModule { }

@NgModule({
    declarations: [PurchaseReceiptListComponent],
    imports: [
        CommonModule,
        PurchaseReceiptListRoutingModule,
        ModuleData,
        TableModule,
        InputTextModule,
        ButtonModule,
        CardModule,
        TagModule,
        FloatLabelModule,
        InputIconModule,
        IconFieldModule,
        StickyPageHeaderComponent,
        MTemplateDirective,
        ConfirmDialogModule,
        DropdownModule,
        NgxDaterangepickerMd.forRoot()
    ],
    providers: [DatePipe],
})
export class PurchaseReceiptListModule { }
