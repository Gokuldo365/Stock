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
import { PurityModel } from 'src/Model/purity.model';
import { DropdownModule } from "primeng/dropdown";


@Component({
    selector: 'app-purity',
    templateUrl: './purity.component.html',
    providers: [ConfirmationService]
})

export class PurityComponent implements OnInit {
    PurityList: any = [];
    MetalList: any = [];
    PurityData: PurityModel = new PurityModel;
    PurityForm: FormGroup;
    PurityId: number = 0;

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
        this.PurityId = this.route.snapshot.params["Purity_id"];
        await this.GetPurityList();
        await this.GetMetalList();
        this.helper.HideSpinner();
    }

    FormValidation() {
        this.PurityForm = this.formbuilder.group({
            name: new FormControl("", Validators.compose([Validators.required])),
            code: new FormControl("", Validators.compose([Validators.required])),
            metal_id: new FormControl("", Validators.compose([Validators.required])),
            display_order: new FormControl(""),
            melting: new FormControl("", Validators.compose([Validators.required])),
        });        
    }

    PurityValidationMessage = {
        name: [{ type: "required", message: "Required." }],
        code: [{ type: "required", message: "Required." }],
        metal_id: [{ type: "required", message: "Required." }],
        display_order: [{ type: "required", message: "Please enter display order." }],
        melting: [{ type: "required", message: "Please enter melting value." }],
    };

    async GetMetalList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/Metal/List");    
        if (res.length > 0) {
            this.MetalList = res;
        }
        this.helper.HideSpinner();
    }

    async GetPurityList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/Purity/List");     
        if (res) {
            this.PurityList = res;
        }
        else
        {
            this.PurityList = [];
        }
        this.helper.HideSpinner();
    }

    async EditPurity(id: number) {
        this.helper.ShowSpinner();
        let res = await this.service.GetById(id, "v1/Purity/ById");
        this.PurityData = res;
        this.PurityForm.get('display_order').addValidators(Validators.required)
        this.helper.HideSpinner();
    }

    async SaveOrUpdate() {
         
        if (this.PurityForm.valid) {
            this.helper.ShowSpinner();
            let res: any;
            if (this.PurityData.id) {
                res = await this.service.CommonPut(this.PurityData, `v1/Purity/Update/${this.PurityData.id}`);  
            } else {
                res = await this.service.CommonPost(this.PurityData, "v1/Purity/Insert"); 
            }
            if (res.Type == "S") {
                this.helper.SucessToastr(res.Message);
                this.helper.redirectTo("/Purity");
                this.FormValidation();
                await this.GetPurityList();
            } else {

                this.helper.ErrorToastr(res.Message);
            }
            this.Cancel();
            this.helper.HideSpinner();
        }
        else {
            this.helper.validateAllFormFields(this.PurityForm)
            this.helper.HideSpinner();
        }
    }

    async Delete(id: number, name: string) {
        this.confirmationService.confirm({
          message: 'Are you sure, that you want to delete this Purity - ' + name + '?',
          icon: 'pi pi-question-circle',
          accept: async () => {
            this.helper.ShowSpinner();
            let res = await this.service.Delete(`v1/Purity/Delete/${id}`);   
            if (res.Type == "S") {
              this.helper.SucessToastr(res.Message);
              this.GetPurityList();
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
        this.PurityId = 0;
        this.PurityData = new PurityModel();
        this.helper.redirectTo("Purity");
        this.helper.HideSpinner();
    } 

}

const routes: Routes = [
    { path: "", component: PurityComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PurityRoutingModule { }

@NgModule({
    declarations: [PurityComponent],
    imports: [
        CommonModule,
        PurityRoutingModule,
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
        DropdownModule
    ],
})
export class PurityModule { }
