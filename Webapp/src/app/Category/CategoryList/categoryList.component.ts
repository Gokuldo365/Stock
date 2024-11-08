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
import { CategoryModel } from 'src/Model/Category.model';
import { ConfirmationService } from 'primeng/api';
import { MTemplateDirective } from 'src/Directives/template.directive';
import { StickyPageHeaderComponent } from 'src/app/Shared/sticky-page-header/sticky-page-header.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
@Component({
    selector: 'app-categorylist',
    templateUrl: './categorylist.component.html',
})

export class CategoryListComponent implements OnInit {

    CategoryList: any = [];
    CategoryData: CategoryModel = new CategoryModel;
    CategoryForm: FormGroup;
    CategoryId: number = 0;
    headerPinned: boolean = false;


    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
        private confirmationService: ConfirmationService
    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        await this.GetCategoryList();
        this.helper.HideSpinner();
    }

    async GetCategoryList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/Category/GetAllCatagoryList");
        if (res.length > 0) {
            this.CategoryList = res;
        }
        else {
            this.CategoryList = [];
        }
        this.helper.HideSpinner();
    }

    async AddOrEditCategory(category_id: number,type: any) {
        if(type){
            let data = this.helper.Encrypt(type == "true" ? '1' : '0');
        this.helper.redirectTo(`Category/${category_id}/${data}`);
        }
    }

    async DeleteCategory(id: string, name: string) {
        this.confirmationService.confirm({
            message: 'Are you sure, that you want to delete this Category - ' + name + '?',
            icon: 'pi pi-question-circle',
            accept: async () => {
                this.helper.ShowSpinner();
                let res = await this.service.Delete(`v1/Category/Delete/${id}`);
                if (res.Type == "S") {
                    this.helper.SucessToastr(res.Message);
                    await this.GetCategoryList();
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
    { path: "", component: CategoryListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CategoryListRoutingModule { }

@NgModule({
    declarations: [CategoryListComponent],
    imports: [
        CommonModule,
        CategoryListRoutingModule,
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
export class CategoryListModule { }