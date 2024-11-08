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
import { MixedMaterialModel } from 'src/Model/mixedmaterial.model';

@Component({
    selector: 'app-mixedmaterial',
    templateUrl: './mixedmaterial.component.html',
    providers: [ConfirmationService]
})

export class MixedMaterialComponent implements OnInit {
    MixedMaterialList: any = [];
    MixedMaterialData: MixedMaterialModel = new MixedMaterialModel;
    MixedMaterialForm: FormGroup;
    MixedMaterialId: number = 0;

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
        this.MixedMaterialId = this.route.snapshot.params["mixedmaterial_id"];
        await this.GetMixedMaterialList();
        this.helper.HideSpinner();
    }

    FormValidation()
    {
        this.MixedMaterialForm = this.formbuilder.group({
            name: new FormControl("", Validators.compose([Validators.required])),
            weight: new FormControl("", Validators.compose([Validators.required])),
            karat: new FormControl("", Validators.compose([Validators.nullValidator])),
            cent: new FormControl("", Validators.compose([Validators.nullValidator])),
            display_order: new FormControl(""),
        });
    }

    MixedMaterialValidationMessage = {
        name: [{ type: "required", message: "Required." }],
        weight: [{ type: "required", message: "Required." }],
        display_order: [{ type: "required", message: "Please enter display order." }],
    };

    async GetMixedMaterialList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/MixedMaterial/List");     
        if (res) {
            this.MixedMaterialList = res;
        }
        else
        {
            this.MixedMaterialList = [];
        }
        this.helper.HideSpinner();
    }

    async EditMixedMaterial(id: number) {
        this.helper.ShowSpinner();
        let res = await this.service.GetById(id, "v1/MixedMaterial/ById");
        this.MixedMaterialData = res;
        this.MixedMaterialForm.get('display_order').addValidators(Validators.required);
        this.helper.HideSpinner();
    }

    async SaveOrUpdate() {
        if (this.MixedMaterialForm.valid) {
            this.helper.ShowSpinner();
            let res: any;
            if (this.MixedMaterialData.id) {
                res = await this.service.CommonPut(this.MixedMaterialData, `v1/MixedMaterial/Update/${this.MixedMaterialData.id}`);  
            } else {
                res = await this.service.CommonPost(this.MixedMaterialData, "v1/MixedMaterial/Insert"); 
            }
            if (res.Type == "S") {
                this.helper.SucessToastr(res.Message);
                this.helper.redirectTo("/MixedMaterial");
                this.FormValidation();
                await this.GetMixedMaterialList();
                this.Cancel();
            } else {

                this.helper.ErrorToastr(res.Message);
            }
            this.helper.HideSpinner();
        }
        else {
            this.helper.validateAllFormFields(this.MixedMaterialForm)
            this.helper.HideSpinner();
        }
    }

    async Delete(id: number, name: string) {
        this.confirmationService.confirm({
          message: 'Are you sure, that you want to delete this MixedMaterial - ' + name + '?',
          icon: 'pi pi-question-circle',
          accept: async () => {
            this.helper.ShowSpinner();
            let res = await this.service.Delete(`v1/MixedMaterial/Delete/${id}`);   
            if (res.Type == "S") {
              this.helper.SucessToastr(res.Message);
              this.GetMixedMaterialList();
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
        this.MixedMaterialId = 0;
        this.MixedMaterialData = new MixedMaterialModel();
        this.helper.redirectTo("MixedMaterial");
        this.helper.HideSpinner();
    }

   

}

const routes: Routes = [
    { path: "", component: MixedMaterialComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MixedMaterialRoutingModule { }

@NgModule({
    declarations: [MixedMaterialComponent],
    imports: [
        CommonModule,
        MixedMaterialRoutingModule,
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
export class MixedMaterialModule { }
