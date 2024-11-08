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
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AttributeDetailModel, AttributeModel } from 'src/Model/Attribute.model';
import { AttributeTypeEnum } from 'src/Helper/Enum/ProductEnum';
import { KeyFilterModule } from 'primeng/keyfilter';


@Component({
    selector: 'app-attribute',
    templateUrl: './attribute.component.html',
    providers: [ConfirmationService]

})

export class AttributeComponent implements OnInit {
    AttributeId: any;
    AttributeData: AttributeModel = new AttributeModel();
    AttributeForm: FormGroup;
    headerPinned: boolean = false;
    AttributeDetailList : any = [];
    AttributeTypeList : any = [];
    AttributeList : any = [];
    AttributeDetailId : number = 0;
    AttributeDetailData : AttributeDetailModel = new AttributeDetailModel();
    AttributeDetailForm : FormGroup;
    AttributeDetailDialouge : boolean = false;
    IsUsed: any = false;


    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService,

    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        this.AttributeId = this.route.snapshot.params["id"];
        this.IsUsed = this.helper.Decrypt(this.route.snapshot.params["type"]);
        if(this.IsUsed == '1'){
            this.IsUsed = true;
        }
        else{
            this.IsUsed = false;
        }
        this.AttributeForm = this.formbuilder.group({
            name: new FormControl('', Validators.compose([Validators.required])),
            display_order: new FormControl(""),
        });
        await this.GetAttributeById();
        await this.GetAttributeTypeList();
        await this.GetAttributeList();
        this.helper.HideSpinner();
    }

    AttributeDetailFormValidation()
    {
        this.AttributeDetailForm = this.formbuilder.group({
            attribute_id: new FormControl('', Validators.compose([Validators.nullValidator])),
            name: new FormControl('', Validators.compose([Validators.nullValidator])),
            att_type: new FormControl('', Validators.compose([Validators.required])),
            att_prefix: new FormControl('', Validators.compose([Validators.nullValidator])),
            att_value: new FormControl('', Validators.compose([Validators.required])),
            att_suffix: new FormControl('', Validators.compose([Validators.nullValidator])),
            display_order: new FormControl(""),
            
        });
    }

    AttributeValidationMessages = {
        'name': [{ type: 'required', message: 'Required.' },],
        'display_order': [{ type: "required", message: "Please enter display order." }],
    };

    AttributeDetailValidationMessages = {
        'attribute_id': [{ type: 'required', message: 'Required.' },],
        'name': [{ type: 'required', message: 'Required.' },],
        'att_type': [{ type: 'required', message: 'Required.' },],
        'att_prefix': [{ type: 'required', message: 'Required.' },],
        'att_value': [{ type: 'required', message: 'Required.' },],
        'att_suffix': [{ type: 'required', message: 'Required.' },],
        'display_order': [{ type: "required", message: "Please enter display order." }],
    };

    async GetAttributeTypeList() {
        this.helper.ShowSpinner();
        this.AttributeTypeList = this.helper.ConvertEnumToArray(AttributeTypeEnum);
        this.helper.HideSpinner();
    }

    async GetAttributeById() {
        this.helper.ShowSpinner();
        if (this.AttributeId != 0) {
            this.AttributeData = await this.service.GetById(this.AttributeId, "v1/Attribute/ById"); 
            this.AttributeForm.get('display_order').addValidators(Validators.required);
            await this.GetAttributeDetailList();
        }
        else {
            this.AttributeData = new AttributeModel();
        }
        this.helper.HideSpinner();
    }

    async SaveOrUpdateAttribute() {
        if (this.AttributeForm.valid) {
            this.helper.ShowSpinner();
            let res: any;
            if (this.AttributeId == 0) {
                res = await this.service.CommonPost(this.AttributeData, 'v1/Attribute/Insert');     
            }
            else {
                res = await this.service.CommonPut(this.AttributeData,  `v1/Attribute/Update/${this.AttributeData.id}`) ;   
            }
            if (res.Type == "S") {
                this.helper.HideSpinner();
                this.helper.SucessToastr(res.Message);
                this.helper.redirectTo("/Attribute/" + (res.AddtionalData ?? this.AttributeId));
                this.Cancel();
            }
            else {
                this.helper.HideSpinner();
                this.helper.ErrorToastr(res.Message);
            }
        }
        else {
            this.helper.validateAllFormFields(this.AttributeForm);
        }
    }

    Cancel() {
        this.AttributeData = new AttributeModel();
        this.helper.redirectTo("AttributeList")
    }
    
    async GetAttributeDetailList()
    {
        this.helper.ShowSpinner();
        const res = await this.service.GetAll(`v1/AttributeDetail/ByAttributeId/${this.AttributeId}`);      
        this.AttributeDetailList = res;
        this.helper.HideSpinner();
    }

    async GetAttributeList()
    {
        this.helper.ShowSpinner();
        const res = await this.service.GetAll(`v1/Attribute/List`);   
        this.AttributeList = res;
        this.helper.HideSpinner();
    }
    
    async AddOrEditAttributeDetail(id : number)
    {
        this.helper.ShowSpinner();
        this.AttributeDetailFormValidation();
        this.AttributeDetailId = id;
        if(this.AttributeDetailId != 0)
        {
            const res = await this.service.GetById(this.AttributeDetailId,'v1/AttributeDetail/ById');  
            this.AttributeDetailData = res;
            console.log(this.AttributeDetailData.att_type); 
                // this.AttributeTypeList = this.AttributeDetailData.att_type
        }
        else
        {
            this.AttributeDetailData =  new AttributeDetailModel();
        }
        this.AttributeDetailDialouge = true;
        this.helper.HideSpinner();
    }

    async SaveOrUpdateAttributeDetail()
    {
        if(this.AttributeDetailForm.valid)
        {
            this.helper.ShowSpinner();
            let res : any;
            this.AttributeDetailData.attribute_id = this.AttributeId
            this.AttributeDetailData.name = `${this.AttributeDetailForm.get('att_prefix')?.value || ''} ${this.AttributeDetailForm.get('att_value')?.value || ''} ${this.AttributeDetailForm.get('att_suffix')?.value || ''}`;
            if(this.AttributeDetailId == 0)
            {
                res = await this.service.CommonPost(this.AttributeDetailData,'v1/AttributeDetail/Insert');  
            }
            else
            {
                res = await this.service.CommonPut(this.AttributeDetailData, `v1/AttributeDetail/Update/${this.AttributeDetailData.id}`);  
            }
            if(res.Type == "S")
            {
                this.helper.HideSpinner();
                this.helper.SucessToastr(res.Message);
                this.AttributeDetailDialouge = false;
                await this.GetAttributeDetailList();
                this.Cancel();
            }
            else
            {
                this.helper.HideSpinner();
                this.helper.ErrorToastr(res.Message);
            }
        }
        else
        {
            this.helper.validateAllFormFields(this.AttributeDetailForm);
        }
    }

        async DeleteAttributeDetail(id: number, attribute_detail_name: string) {
            this.confirmationService.confirm({
              message: 'Are you sure, that you want to delete - ' + attribute_detail_name + '?',
              icon: 'pi pi-question-circle',
              accept: async () => {
                this.helper.ShowSpinner();
                let res = await this.service.Delete(`v1/AttributeDetail/Delete/${id}`);    
                if (res.Type == "S") {
                  this.helper.SucessToastr(res.Message);
                  await this.GetAttributeDetailList();
                }
                else {
                  this.helper.ErrorToastr(res.Message);
                }
                this.helper.HideSpinner();
              }
            });
          }

    ClosePopup(){
        this.AttributeDetailDialouge = false;
    }


}

const routes: Routes = [
    { path: "", component: AttributeComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AttributeRoutingModule { }

@NgModule({
    declarations: [AttributeComponent],
    imports: [
        CommonModule,
        AttributeRoutingModule,
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
        DialogModule,
        ConfirmDialogModule,
        KeyFilterModule
    ],
})
export class AttributeModule { }
