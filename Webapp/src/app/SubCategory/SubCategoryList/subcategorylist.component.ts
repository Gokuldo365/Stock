import { Component, OnInit, NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModuleData } from 'src/Helper/Modules';
import { CommonHelper } from 'src/Helper/CommonHelper';
import { CommonService } from 'src/Service/Common.service';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FileUploadModule } from 'primeng/fileupload';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { SubCategoryModel } from 'src/Model/SubCategory.model';
import { ConfirmationService } from 'primeng/api';
import { MTemplateDirective } from 'src/Directives/template.directive';
import { StickyPageHeaderComponent } from 'src/app/Shared/sticky-page-header/sticky-page-header.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
@Component({
    selector: 'app-subcategorylist',
    templateUrl: './subcategorylist.component.html',
})

export class SubCategoryListComponent implements OnInit {
    headerPinned : boolean = false;
    SubCategoryList: any = [];
    SubCategoryData : SubCategoryModel = new SubCategoryModel;
    SubCategoryForm : FormGroup;
    SubCategoryId : number = 0;
    // headerPinned : boolean = false;


    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
        private confirmationService: ConfirmationService        
    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        await this.GetSubCategoryList();
        this.helper.HideSpinner();
    }  

    async GetSubCategoryList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/SubCategory/List");  
        if (res.length > 0) {
            this.SubCategoryList = res;
        }
        this.helper.HideSpinner();
    }

    AddOrEditSubCategory(sub_category_id : number)
    {
        this.helper.redirectTo(`SubCategory/${sub_category_id}`);
    }

    async DeleteSubCategory(id: string, name: string) {
        this.confirmationService.confirm({
          message: 'Are you sure, that you want to delete this SubCategory - ' + name + '?',
          icon: 'pi pi-question-circle',
          accept: async () => {
            this.helper.ShowSpinner();
            let res = await this.service.Delete(`v1/SubCategory/Delete/${id}`);
            if (res.Type == "S") {
              this.helper.SucessToastr(res.Message);
              await this.GetSubCategoryList();

            }
            else {
              this.helper.ErrorToastr(res.Message);
            }
            this.helper.HideSpinner();
          }
        });
      }

}

const routes: Routes = [
    { path: "", component: SubCategoryListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SubCategoryListRoutingModule { }

@NgModule({
    declarations: [SubCategoryListComponent],
    imports: [
        CommonModule,
        SubCategoryListRoutingModule,
        ModuleData,
        TableModule,
        InputTextModule,
        ButtonModule,
        CardModule,
        FloatLabelModule,
        FileUploadModule,
        InputIconModule,
        IconFieldModule,
        StickyPageHeaderComponent,
        MTemplateDirective,
        InputSwitchModule,
        DropdownModule,
        ConfirmDialogModule
    ],
    providers: [ConfirmationService]
})
export class SubCategoryListModule { }