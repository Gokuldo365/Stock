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
import { CompanyModel } from 'src/Model/Company.model';
import { StickyPageHeaderComponent } from "src/app/Shared/sticky-page-header/sticky-page-header.component";
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { id } from 'date-fns/locale';
import { InputSwitchModule } from 'primeng/inputswitch';


@Component({
    selector: 'app-companylist',
    templateUrl: './companylist.component.html',
    providers: [ConfirmationService]
})

export class CompanyComponent implements OnInit {
    CompanyList: any = [];
    CountryList: any = [];
    CurrencyList: any = [];
    CompanyData: CompanyModel = new CompanyModel;
    CompanyForm: FormGroup;
    CompanyId: number = 0;

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
        this.EditCompany();
        this.CompanyId = this.route.snapshot.params["company_id"];
        await this.GetCountryList();
        if (this.CompanyData.country_id) {
            await this.GetCurrencyList(this.CompanyData.country_id);
          }
        // await this.GetCurrencyList(id);
        this.helper.HideSpinner();
    }

    FormValidation() {
        this.CompanyForm = this.formbuilder.group({
            name: new FormControl("", Validators.compose([Validators.required])),
            telephone_no: new FormControl("", Validators.compose([Validators.required])),
            email: new FormControl("", Validators.compose([Validators.required, Validators.email])),
            currency_id: new FormControl("", Validators.compose([Validators.required])),
            country_id: new FormControl("", Validators.compose([Validators.required])),
            postal_code: new FormControl("", Validators.compose([Validators.required])),
            address: new FormControl("", Validators.compose([Validators.required])),
            out_of_stock_product_order: new FormControl("", Validators.compose([Validators.nullValidator])),
        });                
    }

    CompanyValidationMessage = {
        name: [{ type: "required", message: "Required." }],
        telephone_no: [{ type: "required", message: "Required." }],
        email: [{ type: 'required', message: 'Required.' }, { type: 'email', message: "Invalid Email." }],
        currency_id: [{ type: "required", message: "Required." }],
        country_id: [{ type: "required", message: "Required." }],
        postal_code: [{ type: "required", message: "Required." }],
        address: [{ type: "required", message: "Required." }],
    };

    async EditCompany() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/Company/List");  
        if(res[0]){
            this.CompanyData = res[0];
        }

        this.helper.HideSpinner();
    }

    // async GetCountryList() {
    //     this.helper.ShowSpinner();
    //     let res = await this.service.GetAll("v1/Country/List");    
    //     if (res) {
    //         this.CountryList = res;
    //         // this.GetCurrencyList(res[0].currency_id);
    //     } else {
    //         this.CountryList = [];
    //     }
    //     this.helper.HideSpinner();
    // }

    // async GetCurrencyList(country_id) {
    //     this.helper.ShowSpinner();
    //     let res = await this.service.GetAll("v1/Currency/List");
    //     if (res) {
    //         this.CurrencyList = res;
    //         const data = this.CountryList.filter(o=> o.id == country_id);
    //         this.CompanyData.currency_id = data[0].currency.id;

    //     } else {
    //         this.CurrencyList = [];
    //     }
    //     this.helper.HideSpinner();
    // }  

    async GetCountryList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/Country/List");    
        if (res) {
          this.CountryList = res;
          if (!this.CompanyData.country_id && this.CountryList.length > 0) {
            this.CompanyData.country_id = this.CountryList[0].id;
            await this.GetCurrencyList(this.CompanyData.country_id);
          }
        } else {
          this.CountryList = [];
        }
        this.helper.HideSpinner();
      }
    
      async GetCurrencyList(country_id) {
    // }

    // async GetCurrencyList(id: any) {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/Currency/List");
        if (res && this.CountryList.length > 0) {
          const selectedCountry = this.CountryList.find(o => o.id == country_id);
          if (selectedCountry) {
            this.CurrencyList = res.filter(currency => currency.id === selectedCountry.currency.id);
            this.CompanyData.currency_id = selectedCountry.currency.id; 
          } else {
            this.CurrencyList = [];
          }
        } else {
          this.CurrencyList = [];
        }
        this.helper.HideSpinner();
      }
    async SaveOrUpdate() {
        if (this.CompanyForm.valid) {
            this.helper.ShowSpinner();
            let res: any;
            if (this.CompanyData.id)  {       
                res = await this.service.CommonPut(this.CompanyData, `v1/Company/CompanyUpdate/${this.CompanyData.id}`);  
            }
           else{
            res = await this.service.CommonPost(this.CompanyData, "v1/Company/Insert");  
             }
            if (res.Type == "S") {
                this.helper.SucessToastr(res.Message);
                this.helper.redirectTo("/Company");
                this.helper.SetLocalStorage('Company',this.CompanyData);
                this.EditCompany();
            } else {

                this.helper.ErrorToastr(res.Message);
            }
            this.helper.HideSpinner();
        }
        else {
            this.helper.validateAllFormFields(this.CompanyForm)
            this.helper.HideSpinner();
        }
    }

    async Delete(id: number, name: string) {
        this.confirmationService.confirm({
        message: 'Are you sure, that you want to delete this Company - ' + name + '?',
        icon: 'pi pi-question-circle',
        accept: async () => {
            this.helper.ShowSpinner();
            let res = await this.service.Delete(`v1/Company/Delete/${id}`);   
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

    Cancel() {
        this.helper.ShowSpinner();
        this.CompanyId = 0;
        this.CompanyData = new CompanyModel();
        this.helper.redirectTo("Company");
        this.helper.HideSpinner();
    }

   

}

const routes: Routes = [
    { path: "", component: CompanyComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyRoutingModule { }

@NgModule({
    declarations: [CompanyComponent],
    imports: [
        CommonModule,
        CompanyRoutingModule,
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
        InputSwitchModule

    ],
})
export class CompanyModule { }
