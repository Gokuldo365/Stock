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

@Component({
    selector: 'app-metal',
    templateUrl: './metal.component.html',
    providers: [ConfirmationService]
})

export class MetalComponent implements OnInit {
    MetalList: any = [];
    MetalData: MetalModel = new MetalModel;
    MetalForm: FormGroup;
    MetalId: number = 0;

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
        this.MetalId = this.route.snapshot.params["metal_id"];
        await this.GetMetalList();
        this.helper.HideSpinner();
    }

    FormValidation() {
        this.MetalForm = this.formbuilder.group({
            name: new FormControl("", Validators.compose([Validators.required])),
            code: new FormControl("", Validators.compose([Validators.required])),
            display_order: new FormControl(""),
        });                
    }

    MetalValidationMessage = {
        name: [{ type: "required", message: "Required." }],
        code: [{ type: "required", message: "Required." }],
        display_order: [{ type: "required", message: "Please enter display order." }],
    };

    async GetMetalList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/Metal/List");     
        if (res) {
            this.MetalList = res;
        } else {
            this.MetalList = [];
        }
        this.helper.HideSpinner();
    }

    async EditMetal(id: number) {
        this.helper.ShowSpinner();
        let res = await this.service.GetById(id, "v1/Metal/ById");
        this.MetalData = res;
        this.MetalForm.get('display_order').addValidators(Validators.required);
        this.helper.HideSpinner();
    }

    async SaveOrUpdate() {
        if (this.MetalForm.valid) {
            this.helper.ShowSpinner();
            let res: any;
            if (this.MetalData.id) {
                res = await this.service.CommonPut(this.MetalData, `v1/Metal/Update/${this.MetalData.id}`);  
            } else {
                res = await this.service.CommonPost(this.MetalData, "v1/Metal/Insert"); 
            }
            if (res.Type == "S") {
                this.helper.SucessToastr(res.Message);
                this.helper.redirectTo("/Metal");
                this.FormValidation();                
                await this.GetMetalList();
                this.Cancel();
            } else {

                this.helper.ErrorToastr(res.Message);
            }
            this.helper.HideSpinner();
        }
        else {
            this.helper.validateAllFormFields(this.MetalForm)
            this.helper.HideSpinner();
        }
    }

    async Delete(id: number, name: string) {
        this.confirmationService.confirm({
        message: 'Are you sure, that you want to delete this Metal - ' + name + '?',
        icon: 'pi pi-question-circle',
        accept: async () => {
            this.helper.ShowSpinner();
            let res = await this.service.Delete(`v1/Metal/Delete/${id}`);   
            if (res.Type == "S") {
              this.helper.SucessToastr(res.Message);
              this.GetMetalList();
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
        this.MetalId = 0;
        this.MetalData = new MetalModel();
        this.helper.redirectTo("Metal");
        this.helper.HideSpinner();
    }

   

}

const routes: Routes = [
    { path: "", component: MetalComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MetalRoutingModule { }

@NgModule({
    declarations: [MetalComponent],
    imports: [
        CommonModule,
        MetalRoutingModule,
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
export class MetalModule { }
