import { Component, OnInit, NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModuleData } from 'src/Helper/Modules';
import { CommonHelper } from 'src/Helper/CommonHelper';
import { CommonService } from 'src/Service/Common.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { EditorModule } from 'primeng/editor';
import { StickyPageHeaderComponent } from 'src/app/Shared/sticky-page-header/sticky-page-header.component';
import { MTemplateDirective } from 'src/Directives/template.directive';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
})

export class OrderComponent implements OnInit {
    headerPinned : boolean = false;
    OrderId : number = 0;
    OrderForm : FormGroup;
    OrderData : any = [];
    CustomerList : any = [];
    OrderNumber : string = "";
    OrderDataAndTime : string = "";
    BusinessName : string = "";

    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
        private route: ActivatedRoute,
    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        this.OrderId = this.route.snapshot.params["order_id"];
        await this.GetOrderById();
        this.helper.HideSpinner();
    }

    async GetOrderById() {
        this.helper.ShowSpinner();
        if (this.OrderId != 0) {
             
            const res = await this.service.GetAll(`v1/OrderDetail/ByOrderId/${this.OrderId}`);
            this.OrderData = res;
            this.OrderNumber = this.OrderData[0].order_number;
            this.OrderDataAndTime = this.OrderData[0].order_date;
            this.BusinessName = this.OrderData[0].business_name;
        }
        else {
            this.OrderData = [];
        }
        this.helper.HideSpinner();
    }

    Cancel() {
        this.OrderData = {};
        this.helper.redirectTo("OrderList")
    }

}

const routes: Routes = [
    { path: "", component: OrderComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrderRoutingModule { }

@NgModule({
    declarations: [OrderComponent],
    imports: [
        CommonModule,
        OrderRoutingModule,
        ModuleData,
        DropdownModule,
        TableModule,
        ButtonModule,
        PasswordModule,
        CardModule,
        InputTextModule,
        DividerModule,
        FloatLabelModule,
        EditorModule,
        StickyPageHeaderComponent,
        MTemplateDirective,
        DialogModule
    ],
})
export class OrderModule { }