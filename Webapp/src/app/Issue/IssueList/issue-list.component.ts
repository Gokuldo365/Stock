import { Component, OnInit, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { ModuleData } from 'src/Helper/Modules';
import { CommonHelper } from 'src/Helper/CommonHelper';
import { CommonService } from 'src/Service/Common.service';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { MTemplateDirective } from 'src/Directives/template.directive';
import { StickyPageHeaderComponent } from 'src/app/Shared/sticky-page-header/sticky-page-header.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import * as moment from 'moment';
import { DropdownModule } from 'primeng/dropdown';
import { DateFormat } from 'src/Helper/DateFormat';

@Component({
    selector: 'app-issue-list',
    templateUrl: './issue-list.component.html',  
    providers: [ConfirmationService]
})

export class IssueListComponent implements OnInit {

    ReceiptList : any = [];
    IssueForm : FormGroup;
    headerPinned: boolean = false;
    SearchData : any = {
        stock_entry_type : "Issue"
    };
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
        this.IssueForm = this.formbuilder.group({
            date_range: new FormControl('', Validators.compose([Validators.required])),
            metal_id: new FormControl('', Validators.compose([Validators.required])),
            purity_id: new FormControl('', Validators.compose([Validators.required])),
        });
        await this.GetMetalList();    
        await this.Filter();  
         // await this.GetStockEntryList('');
        this.helper.HideSpinner();
    }

    IssueValidationMessage = {
        'date_range': [{ type: 'required', message: 'Required.' },],
        'purity_id': [{ type: 'required', message: 'Required.' },],
        'metal_id': [{ type: 'required', message: 'Required.' },],
    }

    async Filter(){
        this.helper.ShowSpinner();
        let res: any;
        this.SearchData.date_from = null ;
        this.SearchData.date_to = null;
        this.SearchData.metal_id = null;
        this.SearchData.purity_id = null;
         res = await this.service.CommonPost(this.SearchData,'v1/StockEntry/StockEntryList');
         if(res?.length > 0)         
            {
                this.ReceiptList = res;
            }
            else
            {
                this.ReceiptList = [];
            }
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
        this.SearchData.date_from = this.datePipe.transform($event.from?.$d, 'yyyy-MM-dd hh:mm');
        this.SearchData.date_to = this.datePipe.transform($event.to?.$d, 'yyyy-MM-dd hh:mm');
    }

    async GetStockEntryList(value: string,event: any)
    {   
        if (value == "DT") {
                if (event.from != null && event.to != null) {
                    let DateRange = event;
                    let start_date = DateRange?.from?.$d;
                    let end_date = DateRange?.to?.$d;
                    start_date = DateFormat.DateTimeToStringDateTime(new Date(start_date));
                    end_date = DateFormat.DateTimeToStringDateTime(new Date(end_date));
                    this.SearchData.date_from = start_date;
                    this.SearchData.date_to = end_date;
                    let res = await this.service.CommonPost(this.SearchData,'v1/StockEntry/StockEntryList');
                    if(res?.length > 0)         
                        {
                            this.ReceiptList = res;
                        }
                        else
                        {
                            this.ReceiptList = [];
                        }
                  }
        }

        if (value == "PT") {
            if (this.SearchData.purity_id) {
                this.SearchData.purity_id = this.SearchData.purity_id;
                let res = await this.service.CommonPost(this.SearchData,'v1/StockEntry/StockEntryList');
                if(res?.length > 0)         
                {
                    this.ReceiptList = res;
                }
                else
                {
                    this.ReceiptList = [];
                }
            } else {
                delete this.SearchData.purity_id;
            }
        }
    }
    
    

    AddOrEditPurchase(purchase_id : any) {
        this.helper.redirectTo(`Issue/${purchase_id}/I`);
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
    { path: "", component: IssueListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IssueListRoutingModule { }

@NgModule({
    declarations: [IssueListComponent],
    imports: [
        CommonModule,
        IssueListRoutingModule,
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
export class IssueListModule { }
