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
import { CurrencyModel } from 'src/Model/Currency.model';
import { StickyPageHeaderComponent } from "src/app/Shared/sticky-page-header/sticky-page-header.component";
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from "primeng/dropdown";


@Component({
    selector: 'app-currency',
    templateUrl: './currency.component.html',
    providers: [ConfirmationService]
})

export class CurrencyComponent implements OnInit {
    CurrencyList: any = [];
    CurrencyData: CurrencyModel = new CurrencyModel;
    CurrencyForm: FormGroup;
    CurrencyId: number = 0;

    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService
    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        this.CurrencyId = this.route.snapshot.params["currency_id"];
        this.CurrencyForm = this.formbuilder.group({
            name: new FormControl("", Validators.compose([Validators.required])),
            code: new FormControl("", Validators.compose([Validators.required])),
            symbol: new FormControl("", Validators.compose([Validators.required])),

        });
        await this.GetCurrencyList();
        await this.CurrencyGetById(this.CurrencyId);
        this.helper.HideSpinner();
    }

    CurrencyValidationMessage = {
        name: [{ type: "required", message: "Required." }],
        code: [{ type: "required", message: "Required." }],
        symbol: [{ type: "required", message: "Required." }],
    };

    async GetCurrencyList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("CurrencyList");
        if (res) {
            this.CurrencyList = res;
        }
        this.helper.HideSpinner();
    }

    async CurrencyGetById(id: number) {
        this.helper.ShowSpinner();
        let res = await this.service.GetById(id, "CurrencyById");
        if (res) {
            this.CurrencyData = res;
        }
        this.helper.HideSpinner();
    }

    async EditCurrencyList(id: any) {
        this.helper.ShowSpinner();
        if (id > 0) {
            this.CurrencyId = id;
            this.helper.redirectTo("Currency/" + id);
        }
        this.helper.HideSpinner();
    }

    async SaveOrUpdate() {
        if (this.CurrencyForm.valid) {
            this.helper.ShowSpinner();
            let res: any;
            this.CurrencyData.created_by_id = this.helper.GetUserInfo().id;
            if (this.CurrencyData.id) {
                res = await this.service.CommonPut(this.CurrencyData, "CurrencyUpdate");
            } else {
                res = await this.service.CommonPost(this.CurrencyData, "CurrencyInsert");
            }
            if (res.Type == "S") {
                this.helper.SucessToastr(res.Message);
                this.helper.RefreshredirectTo("Currency");
                await this.GetCurrencyList();
            } else {

                this.helper.ErrorToastr(res.Message);
            }
            this.helper.HideSpinner();
        }
        else {
            this.helper.validateAllFormFields(this.CurrencyForm)
            this.helper.HideSpinner();
        }
    }

    async Delete(id: number, name: string) {
        this.confirmationService.confirm({
          message: 'Are you sure, that you want to delete this Currency - ' + name + '?',
          icon: 'pi pi-question-circle',
          accept: async () => {
            this.helper.ShowSpinner();
            let res = await this.service.Delete(`CurrencyDelete/${id}`);
            if (res.Type == "S") {
              this.helper.SucessToastr(res.Message);
              this.GetCurrencyList();
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
        this.CurrencyId = 0;
        this.CurrencyData = new CurrencyModel();
        this.helper.redirectTo("Currency");
        this.helper.HideSpinner();
    }

}

const routes: Routes = [
    { path: "", component: CurrencyComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CurrencyRoutingModule { }

@NgModule({
    declarations: [CurrencyComponent],
    imports: [
        CommonModule,
        CurrencyRoutingModule,
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
export class CurrencyModule { }
