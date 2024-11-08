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
import { MetalModel } from 'src/Model/Metal.model';
import { StickyPageHeaderComponent } from "src/app/Shared/sticky-page-header/sticky-page-header.component";
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
    selector: 'app-,check-out',
    templateUrl: './check-out.component.html',
    providers: [ConfirmationService]
})

export class CheckOutComponent implements OnInit {
    ProductList : any = [];
    BusinessListDropdown : any = [];
    CheckOutData : any = {};
    CheckOutForm : FormGroup;
    OrderDetailDialouge : boolean = false;
    ProductType : string = "";
    EditOrderData : any = {};
    CustomerInfo : any = {};

    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService

    ) { this.CheckOutData.order_date = new Date(); this.CheckOutData.order_no = "AUTO NUMBER"}

    async ngOnInit() {
        this.helper.ShowSpinner();
        this.CheckOutForm = this.formbuilder.group({
            business_id: new FormControl("", Validators.compose([Validators.required])),
            order_date: new FormControl("", Validators.compose([Validators.required])),
            order_no: new FormControl("", Validators.compose([Validators.nullValidator])),
        });
        await this.GetBusinessList();
        this.GetCartData();
        this.helper.HideSpinner();
    }

    CheckOutValidationMessage = {
        business_id: [{ type: "required", message: "Required." }],
        order_date: [{ type: "required", message: "Required." }],
    }

    async GetBusinessList()
    {
        
        this.helper.ShowSpinner();
        const res = await this.service.GetAll('v1/Business/List');
        if(res?.length > 0)
        {   
            this.BusinessListDropdown = res;
        }
        else
        {
            this.BusinessListDropdown = [];
        }
    }

    GetBusinessInfoEvent($event)
    {
        this.helper.ShowSpinner();
        const business_id = $event;
        this.CustomerInfo = this.BusinessListDropdown.filter(o=> o.id == business_id);
        this.helper.HideSpinner();
    }

    async GetCartData()
    {
        this.helper.ShowSpinner();
        const res = await this.service.GetAll('v1/TempCart/List');
        for (const obj of res)
        {
            obj["item_model"] = obj.product_name + " - " + obj.product_code;
        }
        this.ProductList = res;
        this.helper.HideSpinner();
    }

    async EditOrder(id)
    {
        this.helper.ShowSpinner();
        const cart_id = id;
        let res = await this.service.GetById(cart_id,'v1/TempCart/ById');
        this.EditOrderData = res;
        this.helper.HideSpinner();
    }

    async ConfimOrder()
    {
        if(this.CheckOutForm.valid)
        {
            this.helper.ShowSpinner();
            let SaveData : any = {};
            SaveData.order_date = this.CheckOutData.order_date;
            SaveData.business_id = this.CheckOutData.business_id;
            let IP_Product :  any = [];
            let AP_Product : any = [];
            SaveData.Individual_product_list = [];
            SaveData.Attribute_product_list = [];
            IP_Product = this.ProductList.filter(o=> o.product_type == 'IP');
            AP_Product = this.ProductList.filter(o=> o.product_type == 'AP');

            if(IP_Product?.length > 0)
            {
                for (const obj of IP_Product)
                {
                    SaveData.Individual_product_list.push({
                        product_id : obj.product_id,
                        metal_id : obj.metal_id,
                        purity_id : obj.purity_id,
                        category_id : obj.category_id,
                        quantity : obj.quantity
                    })
                }

            }
            if(AP_Product?.length > 0)
            {
                for (const item of AP_Product)
                {
                    SaveData.Attribute_product_list.push({
                        product_id : item.product_id,
                        quantity : item.quantity,
                        combination : item.product_combination,
                        product_variants_id : item.product_variants_id,
                        metal_id : item.metal_id,
                        purity_id : item.purity_id,
                        category_id : item.category_id
                    })
                    
                }
            }
            let res = await this.service.CommonPost(SaveData,'v1/OrderDetail/Insert');
            if(res.Type == "S")
            {
                this.helper.HideSpinner();
                this.helper.SucessToastr(res.Message);
                this.helper.SetLocalStorage('Cart',[]);
                this.helper.redirectTo("/Order/" + (res.AddtionalData));
            }
            else
            {
                this.helper.HideSpinner();
                this.helper.ErrorToastr(res.Message);
            }
        }
        else
        {
            this.helper.validateAllFormFields(this.CheckOutForm);
        }
    }

    async UpdateOrder()
    {
        this.helper.ShowSpinner();
        let res = await this.service.CommonPut(this.EditOrderData,`TempCart/Update/{Id}`);
        if(res.Type == "S")
        {
            this.helper.HideSpinner();
            this.helper.SucessToastr(res.Message);
        }
        else
        {
            this.helper.HideSpinner();
            this.helper.ErrorToastr(res.Message);
        }
    }

    CancelDialouge()
    {
        this.OrderDetailDialouge = false;
    }

    BackToCatalog()
    {
        this.helper.redirectTo('product-catalog');   
    }

}

const routes: Routes = [
    { path: "", component: CheckOutComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CheckOutRoutingModule { }

@NgModule({
    declarations: [CheckOutComponent],
    imports: [
        CommonModule,
        CheckOutRoutingModule,
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
        DropdownModule,
        CalendarModule,
        DialogModule,
        FieldsetModule
    ],
})
export class CheckOutModule { }
