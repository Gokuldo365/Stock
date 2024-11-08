import { Component, OnInit, NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModuleData } from 'src/Helper/Modules';
import { CommonHelper } from 'src/Helper/CommonHelper';
import { CommonService } from 'src/Service/Common.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { BadgeModule } from 'primeng/badge';
import { MTemplateDirective } from 'src/Directives/template.directive';
import { StickyPageHeaderComponent } from 'src/app/Shared/sticky-page-header/sticky-page-header.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',  
    providers: [ConfirmationService]
  
})

export class ProductListComponent implements OnInit {
    filterForm: FormGroup = this.fB.group({
        metal_id: [''],
        category_id: [''],
        purity_id: [''],               
    });
    metalList: any[] = [];
    ProductList : any = [];
    headerPinned: boolean = false;
    categoryList: any[] = [];
    purityList: any[] = [];
    get filterFC() {
        return this.filterForm.controls;
      }
    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private fB: FormBuilder,
        private confirmationService: ConfirmationService,        
    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        // await this.GetProductList();
        await this.filterProduct();
        await this.getMetalList();
        this.helper.HideSpinner();
    }
    
    async GetProductList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/Product/List");       
        this.ProductList = res;
        this.helper.HideSpinner();
    }

    AddOrEditProduct(product_id : any,type: any) {
       if(type){
        let data = this.helper.Encrypt(type == "true" ? '1' : '0');
        this.helper.redirectTo(`Product/${product_id}/${data}`);
       }
    }

    async Delete(id: number, name: string) {
        this.confirmationService.confirm({
          message: 'Are you sure, that you want to delete - ' + name + '?',
          icon: 'pi pi-question-circle',
          accept: async () => {
            this.helper.ShowSpinner();
            let res = await this.service.Delete(`v1/Product/Delete/${id}`);    
            if (res.Type == "S") {
              this.helper.SucessToastr(res.Message);
              await this.filterProduct();
            }
            else {
              this.helper.ErrorToastr(res.Message);
            }
            this.helper.HideSpinner();
          }
        });
      }

    async getMetalList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/Metal/List");
        if (res) {
            this.metalList = res;        
        } else {
            this.metalList = [];
        }
        this.helper.HideSpinner();
    }

    async GetPurityListAndCategoryList($event) {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/Purity/List");
        this.filterForm.get('purity_id').setValue('');
        this.filterForm.get('category_id').setValue('');
        if(res?.length > 0) {
          this.purityList = res.filter(o=> o.metal_id == $event);
          let category_res = await this.service.GetAll('v1/Category/GetAllCatagoryList');          
          if(category_res?.length > 0) {
            this.categoryList = category_res.filter(o=> o.metal_id == $event);
          }
          else {
            this.categoryList = [];
          }
        }
        else {
          this.purityList = [];
          this.categoryList = [];
        }
        await this.filterProduct();
        this.helper.HideSpinner();
      }
    

    async filterProduct() {
        if(this.filterForm.invalid) {
            this.filterForm.markAllAsTouched();
            return
        }
        this.helper.ShowSpinner();
        // const res = await this.service.CommonPost(this.filterForm.value, "v1/Product/ProductFilterList");
        // console.log(res)
        this.ProductList = await this.service.CommonPost(this.filterForm.value, "v1/Product/ProductFilterList");
         
        this.helper.HideSpinner();
    }

}

const routes: Routes = [
    { path: "", component: ProductListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductListRoutingModule { }

@NgModule({
    declarations: [ProductListComponent],
    imports: [
        CommonModule,
        ProductListRoutingModule,
        ModuleData,
        TableModule,
        InputTextModule,
        ButtonModule,
        CardModule,
        TagModule,
        FloatLabelModule,
        InputIconModule,
        IconFieldModule,
        StickyPageHeaderComponent,
        MTemplateDirective,
        ConfirmDialogModule,
        DropdownModule
    ],
})
export class ProductListModule { }
