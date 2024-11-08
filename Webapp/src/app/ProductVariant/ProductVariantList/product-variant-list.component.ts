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

@Component({
    selector: 'app-product-variant-list',
    templateUrl: './product-variant-list.component.html',  
    providers: [ConfirmationService]
  
})

export class ProductVariantListComponent implements OnInit {

    ProductVariantList : any = [];
    headerPinned: boolean = false;
    
    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
        private confirmationService: ConfirmationService

    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        await this.GetProductVariantList();
        this.helper.HideSpinner();
    }
    
    async GetProductVariantList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/ProductVariant/List");   
        this.ProductVariantList = res;
        this.helper.HideSpinner();
    }

    AddOrEditProductVariant(variant_id : any) {
        this.helper.redirectTo(`ProductVariant/${variant_id}`);
    }

    async Delete(id: number, name: string) {
        this.confirmationService.confirm({
          message: 'Are you sure, that you want to delete - ' + name + '?',
          icon: 'pi pi-question-circle',
          accept: async () => {
            this.helper.ShowSpinner();
            let res = await this.service.Delete(`v1/ProductVariant/Delete/${id}`);     
            if (res.Type == "S") {
              this.helper.SucessToastr(res.Message);
              await this.GetProductVariantList();
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
    { path: "", component: ProductVariantListComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductVariantListRoutingModule { }

@NgModule({
    declarations: [ProductVariantListComponent],
    imports: [
        CommonModule,
        ProductVariantListRoutingModule,
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
        ConfirmDialogModule
    ],
})
export class ProductVariantListModule { }
