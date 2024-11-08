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


@Component({
    selector: 'app-country',
    templateUrl: './country.component.html',
    providers: [ConfirmationService]
})

export class CountryComponent implements OnInit {
    CountryList: any = [];
    CurrencyList: any = [];
    CountryData: CountryModel = new CountryModel;
    CountryForm: FormGroup;
    CountryId: number = 0;

    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService
    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        this.CountryId = this.route.snapshot.params["country_id"];
      this.FormValidation();
        await this.GetCountryList();
        await this.GetCurrencyList();
        this.helper.HideSpinner();
    }

    FormValidation(){
        this.CountryForm = this.formbuilder.group({
            name: new FormControl("", Validators.compose([Validators.required])),
            code: new FormControl("", Validators.compose([Validators.required])),
            currency_id: new FormControl("", Validators.compose([Validators.required])),
        });
    }

    CountryValidationMessage = {
        name: [{ type: "required", message: "Required." }],
        code: [{ type: "required", message: "Required." }],
        currency_id: [{ type: "required", message: "Required." }],
    };

    async GetCountryList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/Country/List"); 
        if (res) {
            this.CountryList = res;
        }
        this.helper.HideSpinner();
    }

    async GetCurrencyList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/Currency/List");        
        if (res) {
            this.CurrencyList = res;
        }
        this.helper.HideSpinner();
    }

    async CountryGetById(id: number) {
        this.helper.ShowSpinner();
        let res = await this.service.GetById(id, "v1/Country/ById");       
        if (res) {
            this.CountryData = res;
        }
        this.helper.HideSpinner();
    }

    async SaveOrUpdate() {
        if (this.CountryForm.valid) {
            this.helper.ShowSpinner();
            let res: any;
            if (this.CountryData.id) {
                res = await this.service.CommonPut(this.CountryData, `v1/Country/Update/${this.CountryData.id}`);
            } else {
                res = await this.service.CommonPost(this.CountryData, "v1/Country/Insert"); 
            }
            if (res.Type == "S") {
                this.helper.SucessToastr(res.Message);
                this.helper.redirectTo("/Country");
                this.FormValidation();                
                await this.GetCountryList();
                this.Cancel();
            } else {

                this.helper.ErrorToastr(res.Message);
            }
            this.helper.HideSpinner();
        }
        else {
            this.helper.validateAllFormFields(this.CountryForm)
            this.helper.HideSpinner();
        }
    }

    async Delete(id: number, name: string) {
        this.confirmationService.confirm({
          message: 'Are you sure, that you want to delete this Country - ' + name + '?',
          icon: 'pi pi-question-circle',
          accept: async () => {
            this.helper.ShowSpinner();
            let res = await this.service.Delete(`v1/Country/Delete/${id}`);   
            if (res.Type == "S") { 
              this.helper.SucessToastr(res.Message);
              this.GetCountryList();
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
        this.CountryId = 0;
        this.CountryData = new CountryModel();
        this.helper.redirectTo("Country");
        this.helper.HideSpinner();
    }

}

const routes: Routes = [
    { path: "", component: CountryComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CountryRoutingModule { }

@NgModule({
    declarations: [CountryComponent],
    imports: [
        CommonModule,
        CountryRoutingModule,
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
        DropdownModule
    ],
})
export class CountryModule { }
