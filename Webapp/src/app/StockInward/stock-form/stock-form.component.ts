import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberInputEvent, InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { CommonHelper } from 'src/Helper/CommonHelper';
import { ModuleData } from 'src/Helper/Modules';
import { CommonService } from 'src/Service/Common.service';

@Component({
  selector: 'app-stock-form',
  standalone: true,
  imports: [
    CommonModule,
    ModuleData,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    InputNumberModule
  ],
  templateUrl: './stock-form.component.html',
  styleUrl: './stock-form.component.css',
  providers: [
    DialogService
  ],
})
export class StockFormComponent {
  stockForm: FormGroup = this.fb.group({
    id: [''],
    status: [''],
    stock_entry_id: ['', Validators.required],
    stock_entry_type: ['', Validators.required],
    // metal_id: ['', Validators.required],
    category_id: ['', Validators.required],
    product_id: ['', Validators.required],
    // purity: ['', Validators.required],
    variant_id: ['', Validators.required],
    combination: ['', Validators.required],
    stock_qty: ['', Validators.required],
    gross_weight: [0, Validators.required],
    // stone_wt: [0, Validators.required],
    // enamel_wt: [0, Validators.required],
    // hook_wt: [0, Validators.required],
    net_weight: ['', Validators.required],
    mixed_material: this.fb.array([])
  });

  metalList: any[] = [];
  purityList: any[] = [];
  categoryList: any[] = [];
  metalCategoryList: any[] = [];
  variantList: any[] = [];
  stockInfo: any = {};
  productList: any[] = [];
  get stockFc() {
    return this.stockForm.controls;
  }

  get mixedMaterialFA() {
    return this.stockForm.get('aliases') as FormArray;
  }

  constructor(
    private ref: DynamicDialogRef,
    private fb: FormBuilder,
    public helper: CommonHelper,
    private service: CommonService,
    public config: DynamicDialogConfig
  ) {}

  async ngOnInit() {
    this.stockInfo = this.config.data;
    await this.getMetalList();
    await this.getCategoryListEvent();
    await this.getProductList();
    // this.stockFc.metal_id.valueChanges.subscribe((newValue) => {
    //   console.log('metal change',newValue);
    //   this.metalCategoryList = this.categoryList.filter(o=> o.metal_id == newValue)
    // });
    // combineLatest([
    //   this.stockForm.controls.gross_weight.valueChanges,
    //   this.stockForm.controls.stone_wt.valueChanges,
    //   this.stockForm.controls.enamel_wt.valueChanges,
    //   this.stockForm.controls.hook_wt.valueChanges,
    // ]).subscribe(([grossWt, stoneWt, enamelWt, hookWt]) => {      
    //   const newValue = grossWt + stoneWt + enamelWt + hookWt; 
    //   this.stockForm.get('')
    // });
  }

  saveStock() {
    console.log(this.stockForm.value)
    if(this.stockForm.invalid) {
      this.stockForm.markAllAsTouched();
      return;
    }
  }

  async getProductList() {
    this.helper.ShowSpinner();
    const res = await this.service.CommonPost({metal_id: this.stockInfo.metal_id, purity_id: this.stockInfo.purity_id}, 'v1/StockEntryDetail/StockProductList');
    if(res?.length > 0)  {
        this.productList = res;
    }   
    this.helper.HideSpinner();
  }

  async getMetalList() {    
    this.helper.ShowSpinner();
    const res = await this.service.GetAll('v1/Metal/List');
    if(res?.length > 0)  {
        this.metalList = res;
    }
    else {
        this.metalList = [];
    }
    this.helper.HideSpinner();
  }

  async getCategoryListEvent() {
    this.helper.ShowSpinner();
    const res = await this.service.GetAll('v1/Category/List');
    if(res?.length > 0) {
        // this.categoryList = res.filter(o=> o.metal_id == $event);
        this.categoryList = res;
    }
    else {
      this.categoryList = [];
    }
    this.helper.HideSpinner();
  }

  weightChange(event: InputNumberInputEvent, fCName: 'gross_weight' | 'stone_wt' | 'enamel_wt' | 'hook_wt') {
    const gW = this.stockFc['gross_weight'].value;
    const sW = this.stockFc['stone_wt'].value;
    const eW = this.stockFc['enamel_wt'].value;
    const hW = this.stockFc['hook_wt'].value;
    this.stockForm.get('net_weight').setValue(gW+sW+eW+hW)
    console.log(event);
    console.log(this.stockFc[fCName].value);
  }

  productChange(eve: DropdownChangeEvent) {
    console.log(eve)
  }
}
