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
import { StickyPageHeaderComponent } from "src/app/Shared/sticky-page-header/sticky-page-header.component";
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputNumberModule } from 'primeng/inputnumber';
import { UnitofMeasurementModel } from 'src/Model/UnitofMeasurement.model';

@Component({
    selector: 'app-UnitofMeasurement',
    templateUrl: './unitofmeasurement.component.html',
    providers: [ConfirmationService]
})

export class UnitofMeasurementComponent implements OnInit {
    UnitofMeasurementList: any = [];
    UnitofMeasurementData: UnitofMeasurementModel = new UnitofMeasurementModel;
    UnitofMeasurementForm: FormGroup;
    UnitofMeasurementId: number = 0;

    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService

    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        this.UnitofMeasurementId = this.route.snapshot.params["unitofmeasurement_id"];
        this.FormValidation();
        await this.GetUnitofMeasurementList();
        this.helper.HideSpinner();
    }

    FormValidation()
    {
        this.UnitofMeasurementForm = this.formbuilder.group({
            name: new FormControl("", Validators.compose([Validators.required])),
            code: new FormControl("", Validators.compose([Validators.required])),
            quantity: new FormControl("", Validators.compose([Validators.required])),
            display_order: new FormControl(""),
        });
    }

    UnitofMeasurementValidationMessage = {
        name: [{ type: "required", message: "Required." }],
        code: [{ type: "required", message: "Required." }],
        quantity: [{ type: "required", message: "Required." }],
        display_order: [{ type: "required", message: "Please enter display order." }],
    };

    async GetUnitofMeasurementList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/UnitOfMeasurement/List");
        if (res) {
            this.UnitofMeasurementList = res;
        }
        else {
            this.UnitofMeasurementList = [];
        }
        this.helper.HideSpinner();
    }

    async EditUnitofMeasurement(id: number) {
        this.helper.ShowSpinner();
        let res = await this.service.GetById(id, "v1/UnitOfMeasurement/ById");
        this.UnitofMeasurementData = res;
        this.UnitofMeasurementForm.get('display_order').addValidators(Validators.required);
        this.helper.HideSpinner();
    }

    async SaveOrUpdate() {
        if (this.UnitofMeasurementForm.valid) {
            this.helper.ShowSpinner();
            let res: any;
            if (this.UnitofMeasurementData.id) {
                res = await this.service.CommonPut(this.UnitofMeasurementData, `v1/UnitOfMeasurement/Update/${this.UnitofMeasurementData.id}`);
            } else {
                res = await this.service.CommonPost(this.UnitofMeasurementData, "v1/UnitOfMeasurement/Insert");
            }
            if (res.Type == "S") {
                this.helper.SucessToastr(res.Message);
                this.helper.redirectTo("/UnitOfMeasurement");
                this.FormValidation();
                await this.GetUnitofMeasurementList();
                this.Cancel();
            } else {

                this.helper.ErrorToastr(res.Message);
            }
            this.helper.HideSpinner();
        }
        else {
            this.helper.validateAllFormFields(this.UnitofMeasurementForm)
            this.helper.HideSpinner();
        }
    }

    async Delete(id: number, name: string) {
        this.confirmationService.confirm({
            message: 'Are you sure, that you want to delete this UnitofMeasurement - ' + name + '?',
            icon: 'pi pi-question-circle',
            accept: async () => {
                this.helper.ShowSpinner();
                let res = await this.service.Delete(`v1/UnitOfMeasurement/Delete/${id}`);
                if (res.Type == "S") {
                    this.helper.SucessToastr(res.Message);
                    this.GetUnitofMeasurementList();
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
        this.UnitofMeasurementId = 0;
        this.UnitofMeasurementData = new UnitofMeasurementModel();
        this.helper.redirectTo("UnitOfMeasurement");
        this.helper.HideSpinner();
    }



}

const routes: Routes = [
    { path: "", component: UnitofMeasurementComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UnitofMeasurementRoutingModule { }

@NgModule({
    declarations: [UnitofMeasurementComponent],
    imports: [
        CommonModule,
        UnitofMeasurementRoutingModule,
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
        InputNumberModule
    ],
})
export class UnitofMeasurementModule { }
