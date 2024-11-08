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
import { FieldsetModule } from 'primeng/fieldset';
import { MTemplateDirective } from 'src/Directives/template.directive';
import { StickyPageHeaderComponent } from 'src/app/Shared/sticky-page-header/sticky-page-header.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import * as moment from 'moment';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',  
    providers: [ConfirmationService],
})

export class OrderListComponent implements OnInit {

    OrderList : any = [];
    headerPinned: boolean = false;
    OrderSearchData : any = {};
    BusinessDropdown : any = [];
    OrderForm : FormGroup;
    BusinessCategoryDropdown : any = [];
    CustomerInfo : any = {};
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

    )   {}

    async ngOnInit() {
        this.helper.ShowSpinner();
        // await this.GetBusinessList();
        // await this.GetOrderList();
        await this.Filter();
        await this.GetBusinessCategoryList();

        this.helper.HideSpinner();
    }

    async Filter(){
        this.helper.ShowSpinner();
        let res: any;
        this.OrderSearchData.date_from  = null ;
        this.OrderSearchData.date_to = null;
        this.OrderSearchData.business_id = null;
         res = await this.service.CommonPost(this.OrderSearchData,'v1/OrderDetail/OrderList');
        if(res?.length > 0)         
            {
                this.OrderList = res;
            }
            else
            {
                this.OrderList = [];
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

    async GetDateRange($event)
    {
        this.OrderSearchData.date_from = this.datePipe.transform($event.from.$d, 'yyyy-MM-dd hh:mm');
        this.OrderSearchData.date_to = this.datePipe.transform($event.to.$d, 'yyyy-MM-dd hh:mm');

        this.GetOrderList('DT');
    }

    async GetBusinessList(categoryId)
    {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/Business/List");        
        if(res?.length > 0)
        {
            this.BusinessDropdown =  res.filter(business => business.business_category_id === categoryId);
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

    GetBusinessDetails($event)
    {
        this.helper.ShowSpinner();
        const business_id = $event;
        this.CustomerInfo = this.BusinessDropdown.filter(o=> o.id == business_id);
        this.helper.HideSpinner();
    }
    
    async GetOrderList(value: string) {
        this.helper.ShowSpinner();
        if (value === "DT") {
            if (this.OrderSearchData.date_from && this.OrderSearchData.date_to) {
                this.OrderSearchData.date_from = this.OrderSearchData.date_from;
                this.OrderSearchData.date_to = this.OrderSearchData.date_to;
                let res = await this.service.CommonPost(this.OrderSearchData,'v1/OrderDetail/OrderList');
                 if(res?.length > 0)
                  {
                    this.OrderList = res;
                  }
                 else
                  {
                    this.OrderList = [];
                  }
            } else {
                delete this.OrderSearchData.date_from;
                delete this.OrderSearchData.date_to;
            }
        }
         if (value === "BL") {
                if (this.OrderSearchData.business_id) {
                    this.OrderSearchData.business_id = this.OrderSearchData.business_id;
                    let res = await this.service.CommonPost(this.OrderSearchData,'v1/OrderDetail/OrderList');
                    if(res?.length > 0)
                        {
                          this.OrderList = res;
                        }
                       else
                        {
                          this.OrderList = [];
                        }
                } else {
                    delete this.OrderSearchData.business_id;
                }
            }
         
        // let res = await this.service.CommonPost(this.OrderSearchData,'v1/OrderDetail/OrderList');
        // if(res?.length > 0)
        // {
        //     this.OrderList = res;
        // }
        // else
        // {
        //     this.OrderList = [];
        // }
        this.helper.HideSpinner();
    }

    AddOrEditOrder(order_id : any) {
        this.helper.redirectTo(`Order/${order_id}`);
    }

    async Delete(id: number, name: string) {
        this.confirmationService.confirm({
          message: 'Are you sure, that you want to delete - ' + name + '?',
          icon: 'pi pi-question-circle',
          accept: async () => {
            this.helper.ShowSpinner();
            let res = await this.service.Delete(`/${id}`);
            if (res.Type == "S") {
              this.helper.SucessToastr(res.Message);
            //   await this.GetOrderList();
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
    { path: "", component: OrderListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrderListRoutingModule { }

@NgModule({
    declarations: [OrderListComponent],
    imports: [
        CommonModule,
        OrderListRoutingModule,
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
        CalendarModule,
        DropdownModule,
        FieldsetModule,
        NgxDaterangepickerMd.forRoot()

    ],
    providers: [DatePipe],

})
export class OrderListModule { }
