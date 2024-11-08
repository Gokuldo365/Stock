import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonHelper } from 'src/Helper/CommonHelper';
import { ModuleData } from 'src/Helper/Modules';
import { CommonService } from 'src/Service/Common.service';

@Component({
  selector: 'app-outward-stock-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ModuleData,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    InputNumberModule,
    InputTextareaModule
  ],
  templateUrl: './outward-stock-product-form.component.html',
  styleUrl: './outward-stock-product-form.component.css'
})
export class OutwardStockProductFormComponent {
  @ViewChild('qtyNumIp') qtyNumIp!: InputNumber;
  stockForm: FormGroup = this.fb.group({
    id: [''],
    status: [''],
    stock_entry_id: ['', Validators.required],
    stock_entry_type: ['Outward', Validators.required],    
    category_id: ['', Validators.required],    
    unit_name: [{value: '', disabled: true}, Validators.required],
    product_id: ['', Validators.required], 
    product_id_proxy: ['', Validators.required], 
    product_variants_id: [null, Validators.required],
    product_variants_id_proxy: ['', Validators.required],
    combination: ['', Validators.required],
    stock_qty: ['', Validators.required],
    gross_weight: ['', Validators.required],    
    net_weight: ['', Validators.required],
    other_weight: ['', Validators.required],
    mixed_material: this.fb.array([])
  });
  metalList: any[] = [];
  purityList: any[] = [];
  categoryList: any[] = [];
  metalCategoryList: any[] = [];
  variantList: any[] = [];
  stockInfo: any = {};
  stockProductList: any[] = [];
  productList: any[] = [];
  selectedProduct: any;
  selectedVariant: any;

  get stockFc() {
    return this.stockForm.controls;
  }

  get mixedMaterialFA() {
    return this.stockForm.get('mixed_material') as FormArray;
  }
  constructor(
    public ref: DynamicDialogRef,
    private fb: FormBuilder,
    public helper: CommonHelper,
    private service: CommonService,
    public config: DynamicDialogConfig
  ) {}

  async ngOnInit() {    
    this.helper.ShowSpinner();    
    this.stockInfo = this.config.data.stockInfo;    
    console.log('Data Product', this.config.data.product)
    if(this.config.data.isEdit) {
      this.getStockEntryDetail();
      this.stockForm.addControl('notes', new FormControl('', [Validators.required, Validators.minLength(10)]));          
    }
    await this.getProductList();    
    if(!this.config.data.isEdit) {
      this.stockForm.patchValue(this.stockInfo);
      this.stockForm.get('stock_entry_id').setValue(this.stockInfo.id);
      this.stockForm.get('id').setValue('');      
    }
    this.stockForm.get('gross_weight').valueChanges.subscribe((value) => {
      this.calculateNetWeight(value, this.mixedMaterialFA.value)
    });
    this.stockForm.get('mixed_material').valueChanges.subscribe(async (value) => {      
      this.calculateNetWeight(this.stockFc.gross_weight.value, value)      
    });
    this.stockForm.get('product_variants_id_proxy').setValidators([Validators.required, this.hasDuplicateProductVariant.bind(this)]);
    this.stockForm.get('product_id_proxy').setValidators([Validators.required, this.hasDuplicateProduct.bind(this)]);    
    this.helper.HideSpinner();
  }

  hasDuplicateProduct(control: AbstractControl): ValidationErrors | null { 
    if(!control.value) {
      return {required: true};            
    }
    const productId = control.value.product_id;    
    if(this.stockForm.get('product_variants_id').hasValidator(Validators.required)) {
      return null;
    }
    const stockProductIds = this.config.data.stockProducts.productIds;      
    const hasProductId = stockProductIds.includes(productId);    
    // console.log('Product Custom validation', hasProductId)    
    return hasProductId ? {isDuplicate: true} : null;
  }

  hasDuplicateProductVariant(control: AbstractControl): ValidationErrors | null {
    // console.log('Product variant Custom validation')    
    if(!control.value) {
      return {required: true};            
    }
    const productId = this.stockFc?.product_id?.value;
    const variantId = control.value.product_variants_id;
    const stockProductIds = this.config.data.stockProducts.productIds;
    const stockVariantIds = this.config.data.stockProducts.variantIds;   
    const hasProductId = stockProductIds.includes(productId);
    const hasVariant = stockVariantIds.includes(variantId);    
    return hasProductId && hasVariant ? {isDuplicate: true} : null;
  }

  async saveStock() {    
    console.log(this.stockForm)
    if(this.stockForm.invalid) {
      this.stockForm.markAllAsTouched();
      return;
    }
    // console.log(this.stockForm.value);
    const stockValue = this.stockForm.value;
    delete stockValue.product_id_proxy;
    delete stockValue.product_variants_id_proxy;        
    const res = this.config.data.isEdit ? await this.service.CommonPut(stockValue, `v1/StockEntryDetail/Update/${stockValue.id}`) : await this.service.CommonPost(stockValue, 'v1/StockEntryDetail/Insert');
    if(res.Type == "S") {            
      this.helper.SucessToastr(res.Message);
      this.ref.close(true);
    } else {
      this.helper.ErrorToastr(res.Message);
    }
  }

  async getProductList() {
    this.helper.ShowSpinner();
    const res = await this.service.CommonPost({metal_id: this.stockInfo.metal_id, purity_id: this.stockInfo.purity_id}, 'v1/StockEntryDetail/OutwareStockProductList');
    if(res?.length > 0)  {      
        this.stockProductList = res;
        await this.getCategoryList(this.stockProductList);
        if(this.config.data.isEdit) {
          const selectedProduct =  this.stockProductList.find(pro => pro.product_id == this.config.data.product.product_id);          
          this.stockForm.get('product_id_proxy').setValue(selectedProduct);
          await this.categoryChange({value: selectedProduct.category_id});
          this.stockForm.get('category_id').setValue(selectedProduct.category_id);          
          await this.bindValueToForm(selectedProduct);          
        }
        // console.log(this.stockForm.value)
    }   
    this.helper.HideSpinner();
  }

  async productChange(eve: any) {       
    this.mixedMaterialFA.clear();    
    const productIDControl = this.stockForm.get('product_id');
    const productVariantIdControl = this.stockForm.get('product_variants_id');
    const productVariantIdProxControl = this.stockForm.get('product_variants_id_proxy');
    const combinationControl = this.stockForm.get('combination');
    const qtyControl = this.stockForm.get('stock_qty'); 
    productVariantIdControl.setValue(null);
    productVariantIdProxControl.setValue('');    
    combinationControl.setValue('');
    const value = eve.value;       
    const mixedMaterialList =  await this.getMixedMaterialList(eve.value.product_id);
    this.variantList = await this.getVariantList(eve.value.product_id);
    if(this.variantList?.length) {
      productVariantIdControl.setValidators([Validators.required]);      
      productVariantIdProxControl.setValidators([Validators.required, this.hasDuplicateProductVariant.bind(this)]);
      combinationControl.setValidators([Validators.required]);
      qtyControl.setValidators([Validators.required]);
      this.qtyNumIp.max = undefined;   
    } else {      
      productVariantIdControl.setValidators([Validators.nullValidator]);
      productVariantIdProxControl.setValidators([Validators.nullValidator]);
      combinationControl.setValidators([Validators.nullValidator]);
      qtyControl.setValidators([Validators.required, Validators.max(value.stock)]);
      this.qtyNumIp.max = value.stock;
    }    
    productVariantIdControl.updateValueAndValidity();
    combinationControl.updateValueAndValidity();
    productVariantIdProxControl.updateValueAndValidity();
    qtyControl.updateValueAndValidity();
    console.log(this.stockForm);
    mixedMaterialList.forEach((mixMaterial) => {
      this.addMixedMaterialFG(mixMaterial);
    });
    productIDControl.setValue(value.product_id); 
    this.stockForm.get('unit_name').setValue(value.unit_name);
    productIDControl.markAsTouched();  
    console.log(this.stockForm)
  }

  addMixedMaterialFG(mixMaterial: any) {
    const mixMaterialFG: FormGroup = this.fb.group({
      mixed_material_id: ['', Validators.required],
      weight: ['', Validators.required],
      name: [{value: '', disabled: true }]
    });
    mixMaterialFG.patchValue(mixMaterial);
    // console.log(mixMaterialFG)
    this.mixedMaterialFA.push(mixMaterialFG);
  }

  async calculateNetWeight(grossWeight, mixMaterialValue) {
    const mixMaterialWeight = await mixMaterialValue.reduce((accumulator, currentValue) => +accumulator + (currentValue.weight ? +currentValue.weight : 0),0);
    this.stockForm.get('net_weight').setValue(+grossWeight - mixMaterialWeight);
    this.stockForm.get('other_weight').setValue(mixMaterialWeight);
  }

  async variantChange(eve: DropdownChangeEvent) {
    const value = eve.value;    
    const variantIdControl = this.stockForm.get('product_variants_id');
    const combinationControl = this.stockForm.get('combination');
    const qtyControl = this.stockForm.get('stock_qty'); 
    variantIdControl.setValue('');
    variantIdControl.setValue(value.product_variants_id);
    combinationControl.setValue(value.combination);
    qtyControl.setValidators([Validators.required, Validators.max(Math.abs(value.stock))]);
    this.qtyNumIp.max = Math.abs(value.stock); 
    variantIdControl.markAsTouched();
    combinationControl.markAsTouched();
    variantIdControl.updateValueAndValidity();
    qtyControl.updateValueAndValidity();
  }

  async bindValueToForm(val: any) {
    await this.productChange({value: val});    
    this.stockForm.get('product_id_proxy').setValue(val);
    const selectedVariant = this.variantList.find(variant => variant.product_variants_id === this.config.data.product.product_variants_id);    
    this.stockForm.get('product_variants_id_proxy').setValue(selectedVariant);
    const EditableProductVal = JSON.parse(JSON.stringify(this.config.data.product));
    EditableProductVal.mixed_material = JSON.parse(EditableProductVal.mixed_material);    
    if(this.config.data.isEdit) {
      selectedVariant && this.stockForm.get('stock_qty').setValidators([Validators.required, Validators.max(+selectedVariant.stock)]);
      selectedVariant && (this.qtyNumIp.max = Math.abs(selectedVariant.stock)); 
      EditableProductVal.notes = typeof EditableProductVal.history === 'string' ?  JSON.parse(EditableProductVal.history)[0].notes : '';
      EditableProductVal.stock_qty = Math.abs(EditableProductVal.stock_qty);
      EditableProductVal.notes && this.stockForm.disable();
    }      
    this.stockForm.patchValue(EditableProductVal);    
  }

  async getCategoryList(productList: any[]) {    
    const categoryList: any[] = [];
    await productList.reduce((accumulator, currentValue) => {      
      const categoryItem = {name: '', id: ''}
      if(!accumulator.includes(currentValue.category_id)) {
        categoryItem.name = currentValue.category_name;
        categoryItem.id = currentValue.category_id;
        categoryList.push(categoryItem);
        accumulator.push(currentValue.category_id);
        return accumulator;
      }
      return accumulator;
    }, []);
    this.categoryList = categoryList;
    // console.log('Category List', this.categoryList);
  }


  async categoryChange(eve: any) {
    this.productList = this.stockProductList.filter(product => product.category_id === eve.value);
    this.stockForm.get('product_id').setValue('');
    this.stockForm.get('product_id_proxy').setValue('');
    this.stockForm.get('product_variants_id').setValue(null);
    this.stockForm.get('product_variants_id_proxy').setValue('');    
    this.stockForm.get('combination').setValue('');
    this.stockForm.get('unit_name').setValue(''); 
    this.variantList = [];
    this.mixedMaterialFA.clear();
  }

  async getVariantList(id: number) {
    this.helper.ShowSpinner();
    const res = await this.service.GetById(id, 'v1/StockEntryDetail/OutwardVarientList');
    // {"product_variants_id": "3d07c7cc-e775-429d-bfab-a24fea3cc04e", "combination": "6 gm", "inward": "500", "outward": "0", "stock": "500"}    
    this.helper.HideSpinner();
    return res;
  }

  async getMixedMaterialList(id: number) {
    this.helper.ShowSpinner();
    const res = await this.service.GetById(id, 'v1/StockEntryDetail/OutwardMixedMaterialList');    
    this.helper.HideSpinner();
    return res;
  }

  async getStockEntryDetail() {
    const res = await this.service.GetById(this.config.data.product.id, `v1/StockEntryDetail/StockEntryDetailById`);
    console.log('new api', res)
  }

}