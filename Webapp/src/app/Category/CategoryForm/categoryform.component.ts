import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileBeforeUploadEvent, FileProgressEvent, FileRemoveEvent, FileSendEvent, FileUpload, FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { StickyPageHeaderComponent } from 'src/app/Shared/sticky-page-header/sticky-page-header.component';
import { MTemplateDirective } from 'src/Directives/template.directive';
import { CommonHelper } from 'src/Helper/CommonHelper';
import { ModuleData } from 'src/Helper/Modules';
import { CategoryModel } from 'src/Model/Category.model';
import { CommonService } from 'src/Service/Common.service';
import { KeyFilterModule } from 'primeng/keyfilter';
import { DropdownModule } from "primeng/dropdown";
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputSwitchModule } from 'primeng/inputswitch';


@Component({
  selector: 'app-category',
  templateUrl: './categoryform.component.html',
  providers: [ConfirmationService]

})
export class CategoryFormComponent implements OnInit {

  CategoryList: any = [];
  CategoryData: CategoryModel = new CategoryModel();
  CategoryForm: FormGroup;
  CategoryId: number = 0;
  MetalList: any = [];
  CategorybySubCategoryList: any = [];
  IsUsed: any = false;



  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private config: PrimeNGConfig,
    private service: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    public helper: CommonHelper,
    private confirmationService: ConfirmationService

  ) {

  }

  async ngOnInit() {
    this.helper.ShowSpinner();
    this.CategoryId = this.route.snapshot.params["id"];
    this.IsUsed = this.helper.Decrypt(this.route.snapshot.params["type"]);
        if(this.IsUsed == '1'){
            this.IsUsed = true;
        }
        else{
            this.IsUsed = false;
        }
    this.CategoryForm = this.formBuilder.group({
      name: new FormControl("", Validators.compose([Validators.required])),
      metal_id: new FormControl("", Validators.compose([Validators.required])),
      parent_category_id: new FormControl("", Validators.compose([Validators.required])),
      is_stock_category: new FormControl("", Validators.compose([Validators.nullValidator])),
      display_order: new FormControl(""),
    });
    await this.GetMetalList();
    await this.CategoryGetById();
    await this.GetCategorybySubCategories();
    this.helper.HideSpinner();
  }

  CategoryValidationMessage = {
    name: [{ type: "required", message: "Required." }],
    metal_id: [{ type: "required", message: "Required." }],
    description: [{ type: "required", message: "Required." }],
    display_order: [{ type: "required", message: "Please enter display order." }],
  };

  async GetMetalList() {
    this.helper.ShowSpinner();
    let res = await this.service.GetAll("v1/Metal/List");
    if (res.length > 0) {
      this.MetalList = res;
    }
    this.helper.HideSpinner();
  }

  async GetCategorybySubCategories() {
    this.helper.ShowSpinner();
    let res = await this.service.GetAll("v1/Category/GetAllParentCatagoryList");
    this.CategorybySubCategoryList = [
      { id: '0', name: '--- Main Category ---' },
    ];
    if (res.length > 0) {
      for (let obj of res) {
        this.CategorybySubCategoryList.push(obj);
      }
    }
    if (this.CategoryId == 0) {
      this.CategoryData.parent_category_id = '0';
    }
    this.helper.HideSpinner();
  }



  async CategoryGetById() {
    this.helper.ShowSpinner();
    if (this.CategoryId != 0) {
      const res = await this.service.GetById(this.CategoryId, "v1/Category/ById");
      if (res) {
        this.CategoryData = res;
        this.CategoryForm.get('display_order').addValidators(Validators.required);
        if (this.CategoryData.parent_category_id == null) {
          this.CategoryData.parent_category_id = '0';
        }
      }
    }
    else {
      this.CategoryData = new CategoryModel();
    }
    this.helper.HideSpinner();
  }

  async CategorySaveOrUpdate() {
    if (this.CategoryForm.valid) {
      this.helper.ShowSpinner();
      let res: any;
      if (this.CategoryData.id) {
        res = await this.service.CommonPut(this.CategoryData, `v1/Category/Update/${this.CategoryData.id}`);
      } else {
        res = await this.service.CommonPost(this.CategoryData, "v1/Category/Insert");
      }
      if (res.Type == "S") {
        this.helper.SucessToastr(res.Message);
        this.helper.redirectTo("/CategoryList");
      } else {

        this.helper.ErrorToastr(res.Message);
      }
      this.helper.HideSpinner();
    }
    else {
      this.helper.validateAllFormFields(this.CategoryForm)
      this.helper.HideSpinner();
    }
  }

  Cancel() {
    this.helper.ShowSpinner();
    this.CategoryId = 0;
    this.CategoryData = new CategoryModel();
    this.helper.redirectTo("/CategoryList")
    this.helper.HideSpinner();
  }


}

const routes: Routes = [
  { path: "", component: CategoryFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryFormRoutingModule { }

@NgModule({
  declarations: [CategoryFormComponent],
  imports: [
    CommonModule,
    CategoryFormRoutingModule,
    ModuleData,
    ButtonModule,
    CardModule,
    FloatLabelModule,
    FileUploadModule,
    InputIconModule,
    IconFieldModule,
    StickyPageHeaderComponent,
    MTemplateDirective,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    KeyFilterModule,
    DropdownModule,
    ConfirmDialogModule,
    InputSwitchModule
  ],
  providers: [MessageService]
})
export class CategoryFormModule { }
