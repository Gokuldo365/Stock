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
import { SubCategoryModel } from 'src/Model/SubCategory.model';
import { CommonService } from 'src/Service/Common.service';
import { KeyFilterModule } from 'primeng/keyfilter';
import { DropdownModule } from "primeng/dropdown";
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@Component({
  selector: 'app-subcategoryform', 
  templateUrl: './subcategoryform.component.html',
  providers: [ConfirmationService]

})
export class SubCategoryFormComponent implements OnInit {
 
  SubCategoryList: any = [];
  SubCategoryData: SubCategoryModel = new SubCategoryModel();
  SubCategoryForm: FormGroup;
  SubCategoryId: number = 0;
  CategoryList: any = [];


  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private config: PrimeNGConfig,
    private service: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    public helper: CommonHelper,
    private confirmationService: ConfirmationService,

  ) {
    
  }

  async ngOnInit() {
    this.helper.ShowSpinner();
    this.SubCategoryId = this.route.snapshot.params["id"];
    this.SubCategoryForm = this.formBuilder.group({
      name: new FormControl("", Validators.compose([Validators.required])),
      category_id: new FormControl("", Validators.compose([Validators.required])),
      display_order: new FormControl("", Validators.compose([Validators.nullValidator])),
      description: new FormControl("", Validators.compose([Validators.required])),
  });
  this.helper.HideSpinner();
  await this.GetCategoryList();
  await this.SubCategoryGetById();
 
  }

  SubCategoryValidationMessage = {
    name: [{ type: "required", message: "Required." }],
    category_id: [{ type: "required", message: "Required." }],
    display_order: [{ type: "required", message: "Required." }],
    description: [{ type: "required", message: "Required." }],
};

async GetCategoryList() {
  this.helper.ShowSpinner();
  let res = await this.service.GetAll("v1/Category/List");   
  if (res.length > 0) {
      this.CategoryList = res;
  }
  this.helper.HideSpinner(); 
}


async SubCategoryGetById() {
  this.helper.ShowSpinner();
  if (this.SubCategoryId != 0) {
      const res = await this.service.GetById(this.SubCategoryId, "v1/SubCategory/ById");   
      this.SubCategoryData = res;
  }
  else {
      this.SubCategoryData = new SubCategoryModel();
  }
  this.helper.HideSpinner();
}

async SubCategorySaveOrUpdate() {
  if (this.SubCategoryForm.valid) {
      this.helper.ShowSpinner();
      let res: any;
      if (this.SubCategoryData.id) {
          res = await this.service.CommonPut(this.SubCategoryData,`v1/SubCategory/Update/${this.SubCategoryData.id}`); 
      } else {
          res = await this.service.CommonPost(this.SubCategoryData, "v1/SubCategory/Insert");
      }
      if (res.Type == "S") {
          this.helper.SucessToastr(res.Message);
          this.helper.redirectTo("SubCategoryList");
      } else {

          this.helper.ErrorToastr(res.Message);
      }
      this.helper.HideSpinner();
  }
  else {
      this.helper.validateAllFormFields(this.SubCategoryForm)
      this.helper.HideSpinner();
  }
}

Cancel() {
  this.helper.ShowSpinner();
  this.SubCategoryId = 0;
  this.SubCategoryData = new SubCategoryModel();
  this.helper.redirectTo("SubCategoryList");
  this.helper.HideSpinner();
}

}

const routes: Routes = [
  { path: "", component: SubCategoryFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubCategoryFormRoutingModule { }

@NgModule({
  declarations: [SubCategoryFormComponent],
  imports: [
      CommonModule,
      SubCategoryFormRoutingModule,
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
      KeyFilterModule,
      InputTextModule,
      InputTextareaModule,
      DropdownModule,
      ConfirmDialogModule,
  ],
  providers: [MessageService]
})
export class SubCategoryFormModule { }
