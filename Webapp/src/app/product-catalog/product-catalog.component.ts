import { CommonModule, Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { Routes } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';
import { CommonHelper } from 'src/Helper/CommonHelper';
import { ModuleData } from 'src/Helper/Modules';
import { CommonService } from 'src/Service/Common.service';
import { RadioButtonClickEvent, RadioButtonModule } from 'primeng/radiobutton';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataViewLazyLoadEvent, DataViewModule, DataViewPageEvent } from 'primeng/dataview';
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { IconFieldModule } from 'primeng/iconfield'; 
import { InputIconModule } from 'primeng/inputicon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { $$ } from 'protractor';
import { Subject } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [
    CommonModule,    
    ModuleData,      
    ButtonModule,
    CardModule,
    SliderModule,
    SelectButtonModule,
    DropdownModule,
    CheckboxModule,
    AccordionModule,
    InputTextModule,
    RadioButtonModule,
    ImageModule,
    InputNumberModule,
    FloatLabelModule,
    DataViewModule,
    AutoCompleteModule,
    IconFieldModule,
    InputIconModule,
    InputGroupModule,
    InputGroupAddonModule,
    BadgeModule
  ],
  templateUrl: './product-catalog.component.html',
  styleUrl: './product-catalog.component.css'
})
export class ProductCatalogComponent implements OnInit, AfterViewInit {
  @ViewChild('productListContainer') productListContainer: ElementRef
  selectedAttribute: [] = [];  
  proAvailability: boolean = false;
  CartData : any = [];
  productList : any = [];
  metalList: any[] = [];
  categoryList: any[] = [];
  PurityList: any[] = [];
  CompanyList: any[] = [];
  SearchData : any = {};
  weight_range_from : number = 0;
  weight_range_to : number = 0;
  take : number = 10;
  skip : number = 0;
  ProductNameAndCode : string = null;
  // attributeList: any[] = [1,2,3,4,5,6,7,8,9,10];
  SizeList : any = [];
  productTotalCount: number = 0;
  filterForm: FormGroup = this.fB.group({
    metal_id: [''],
    catagory_id: [''],
    purity_id: [''],
    is_stock: ['']
    // weight_range_from : [''],
    // weight_range_to : [''],
    // name_code_filter : [''],
    // proAvailability : [''],    
  });
  weight: any = [0,1000];
  productSuggestions: any[] = []; 
  selectedSearchProduct: any;
  IsOrderProduct : boolean = false;
  weightFilterSub = new Subject();
  get filterFC() {
    return this.filterForm.controls;
  }
  constructor(
    public location: Location,
    public helper: CommonHelper,
    private service: CommonService,
    private fB: FormBuilder
  ) { }

  async ngOnInit() {
    await this.getMetalList();
    await this.GetCompanyData();
    await this.GetSizeList();    
    await this.filterProduct();
    this.weightFilterSub.pipe(throttleTime(1500)).subscribe(() => {      
      console.log('weight throttle');
      this.filterProduct();
    });

  }

  ngAfterViewInit() {
    this.productList = [];
  }

  async filterProduct(rows: number = 10, first: number = 0) {
    // console.log(this.filterForm.value)
    // console.log((this.productListContainer.nativeElement as HTMLElement).getBoundingClientRect())
    this.helper.ShowSpinner();
    let FilterSearchData : any = {};
    // if(this.filterForm.value.metal_id == "") {
    //   this.filterForm.value.metal_id = null;
    // }

    // if(this.filterForm.value.catagory_id == "") {
    //   this.filterForm.value.catagory_id = null;
    // }

    // if(this.filterForm.value.purity_id == "") {
    //   this.filterForm.value.purity_id = null;
    // }
    // if(this.ProductNameAndCode == "") {
    //   FilterSearchData.name_code_filter = null;
    // }
    FilterSearchData = {
      ...this.filterForm.value,
      weight_range_from : this.weight[0],
      weight_range_to : this.weight[1],
      take : rows,
      skip : first,
      sizes : this.selectedAttribute,
      // is_stock : this.proAvailability,
      name_code_filter : this.ProductNameAndCode      
    }
    let res = await this.service.CommonPost(FilterSearchData, 'v1/Product/CatalogFilter');
    if(res?.Data?.length > 0)
    {
      this.productList = res.Data;      
      this.productTotalCount = res.Count.totalCount;
      this.CartData = this.helper.GetLocalStorage('Cart',true);
      if(this.CartData != null)
      {
        for (const obj of this.productList)
        {
          if(obj.product_type == "IP")
          {
            const IPData = this.CartData.filter(o=> o.product_id == obj.product_id)[0].quantity;
            if(IPData?.length > 0)
            {
              obj.quantity = IPData[0].quantity;
              obj["is_cart"] = true;
            }
            else
            {
              obj["is_cart"] = false;
            }
          }
          else
          {
            const APData = obj.quantity = this.CartData.filter(o=> o.product_variants_id == obj.product_variants_id);
            if(APData?.length > 0)
            {
              obj.quantity = APData[0].quantity;
              obj["is_cart"] = true;
            }
            else
            {
              obj["is_cart"] = false;
            }
          }
        }
      }
      else
      {
        this.CartData = [];
      }
    }
    else
    {
      this.productList = [];
      this.productTotalCount = 0;
    }
    this.helper.HideSpinner();
  }

  // async filterProduct() {
  //   // if(this.filterForm.invalid) {
  //   //   this.filterForm.markAllAsTouched();
  //   //   return;
  //   // }   
  //   this.helper.ShowSpinner();
  //   let FilterSearchData : any = {
  //     ...this.filterForm.value,
  //     combination_values: this.selectedAttribute,
  //     limit: 20,
  //     offset: 0    
  //   };    
  //   let res = await this.service.CommonPost(FilterSearchData, 'v1/Product/PoductCatalogFilterList');
  //   if(res?.Data.length > 0) {
  //     this.productList = res.Data;
  //     this.productTotalCount = res.TotalCountProduct[0].total_count
  //   } else {
  //     this.productList = [];
  //   }
  //   this.helper.HideSpinner();
  // }

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
    if(res?.length > 0) {
      this.PurityList = res.filter(o=> o.metal_id == $event);
      let category_res = await this.service.GetAll('v1/Category/GetAllCatagoryList');
      this.filterProduct();
      if(category_res?.length > 0) {
        this.categoryList = category_res.filter(o=> o.metal_id == $event);
      }
      else {
        this.categoryList = [];
      }
    }
    else
    {
      this.PurityList = [];
      this.categoryList = [];
    }
    this.helper.HideSpinner();
  }

  async GetSizeList() {
    this.helper.ShowSpinner();
    let res = await this.service.GetAll('v1/Attribute/AttributeDetailFullList');
    if(res?.length > 0)
    {
      const AttributeId = res.filter(o=> o.name == 'Size')[0].id;
      let detail_res = await this.service.GetAll(`v1/AttributeDetail/ByAttributeId/${AttributeId}`);
      if(detail_res?.length > 0)
      {
        this.SizeList = detail_res;
      }
      else
      {
        this.SizeList = [];
      }
    }
    else
    {
      this.SizeList = [];
    }
    this.helper.HideSpinner();
  }

  async GetCompanyData()
  {
    this.helper.ShowSpinner();
    const Data = this.helper.GetLocalStorage('Company',true);
    if(Data != null)
    {
      this.IsOrderProduct = Data.out_of_stock_product_order;
    }
    this.helper.HideSpinner();
  }

  async AddToCart(ProductData : any = {})
  {
    this.helper.ShowSpinner();
    let SaveData : any = {};
    SaveData.product_name = ProductData.product_name;
    SaveData.product_code = ProductData.product_code;
    SaveData.category_name = ProductData.category_name;
    SaveData.purity = ProductData.purity;
    SaveData.product_id = ProductData.product_id;
    SaveData.product_variants_id = ProductData.product_variants_id ?? "";
    SaveData.combination = ProductData.combination ?? "";
    SaveData.stock = ProductData.stock;
    SaveData.quantity = ProductData.quantity;
    SaveData.is_cart = true;
    let res = await this.service.CommonPost(SaveData,'v1/TempCart/Insert');
    if(res?.Type == "S")
    {
      this.helper.HideSpinner();
      ProductData.is_cart == true;
      this.helper.SucessToastr(res.Message);
    }
    else
    {
      this.helper.HideSpinner();
      this.helper.ErrorToastr(res.Message);
    }
  }

  PlaceOrder()
  {
    this.helper.redirectTo('CheckOut');
  }


  // AddToCart(ProductData : any = {}) {
  //   let CartValue : any = [];
  //   const CartData = this.helper.GetLocalStorage('Cart',true);
  //   if(CartData?.length > 0)
  //   {
  //     if(ProductData.product_type == "IP")
  //     {
  //       CartValue = CartData.filter(o=> o.product_id == ProductData.product_id);
  //     }
  //     else
  //     {
  //       CartValue = CartData.filter(o=> o.product_variants_id == ProductData.product_variants_id);
  //     }
  //   }
  //   if(CartValue?.length == 0)
  //   {
  //     if(ProductData.quantity > 0)
  //     {
  //       ProductData.is_cart = true;
  //       this.CartData.push(ProductData);
  //       this.helper.SucessToastr('Product added to cart.');
  //     }
  //     else
  //     {
  //       this.helper.ErrorToastr('Please provide quantity.');
  //     }
  //   }
  //   else
  //   {
  //     this.helper.ErrorToastr('Selected product already added to cart');
  //   }
  // }

  // PlaceOrder() {
  //   if(this.CartData?.length > 0)
  //   {
  //     this.helper.SetLocalStorage('Cart',this.CartData);
  //     this.helper.redirectTo('CheckOut');
  //   }
  //   else
  //   {
  //     this.helper.ErrorToastr('Please select product to proceed');
  //   }
  // }

  ProductQuantityValidation(item)
  {
    const Quantity = item.quantity;
    const StockQuantity = Number(item.stock);
    if(this.IsOrderProduct == false)
    {
      if(StockQuantity < Quantity)
      {
        this.helper.ErrorToastr(`Available quantity is ${StockQuantity}`);
        item.quantity = 0;
      }
    }
  }


  // async metalChange(eve: DropdownChangeEvent) {
  //   console.log(eve)
  //   this.helper.ShowSpinner();
  //   const res = await this.service.GetAll('v1/Category/List');
  //   if(res?.length > 0) {
  //     this.filterForm.get('catagory_id').setValue('');      
  //     this.filterForm.get('sub_catagory_id').setValue('');
  //     this.selectedAttribute = [];            
  //     this.categoryList = res.filter(o=> o.metal_id == eve.value);
  //   }
  //   else {
  //       this.categoryList = [];
  //   }
  //   this.helper.HideSpinner();
  // }

  // async categoryChange(eve: DropdownChangeEvent) {    
  //   this.helper.ShowSpinner();
  //       const res = await this.service.GetAll('v1/SubCategory/List');
  //       if(res?.length > 0) {
  //         this.filterForm.get('sub_catagory_id').setValue('');
  //         this.selectedAttribute = [];    
  //           // this.subCategoryList = res.filter(o=> o.category_id == eve.value);
  //       }
  //       else {
  //           // this.subCategoryList = [];
  //       }
  //       this.helper.HideSpinner();
  // }

  // async subCategoryChange(eve: DropdownChangeEvent) {    
  //   this.helper.ShowSpinner();
  //       const res = await this.service.GetAll(`v1/Product/ProductAttributeListBy/${eve.value}`);        
  //       if(res?.length > 0) {
  //         this.selectedAttribute = [];
  //         this.attributeList = res
  //       } else {
  //           this.attributeList = [];
  //       }
  //       this.helper.HideSpinner();
  // }

  async productPageEve(eve: DataViewPageEvent) {
    console.log('Pagination Event', eve);    
    // (this.productListContainer.nativeElement as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
    // console.log((this.productListContainer.nativeElement as HTMLElement).getBoundingClientRect());
    // console.log(window.scrollY)
    await this.filterProduct(eve.rows, eve.first);
    const productListEle = (this.productListContainer.nativeElement as HTMLElement).getBoundingClientRect();
    const docTopPosition = document.body.getBoundingClientRect().top;
    console.log(productListEle.top, docTopPosition)
    window.scrollTo({
      top: productListEle.top - docTopPosition - 60,
      behavior: 'smooth',
    })
  }

  async productLazyLoad(eve: DataViewLazyLoadEvent) {
    console.log('Dataview Lazy Load',eve);
  }

  metalRadioIpClick(eve: RadioButtonClickEvent) {
    console.log(eve)
  }

  resetFilterForm(hasToGetProduct: boolean) {    
    this.filterForm.reset();
    this.weight = [0,1000];
    this.selectedAttribute = [];
    hasToGetProduct && this.filterProduct();
  }

  async searchProduct(eve: AutoCompleteCompleteEvent) {
    // console.log(((eve.target) as HTMLInputElement).value)
    // const value = ((eve.target) as HTMLInputElement).value;
    
    const value = eve.query;
    console.log(value)
    let res = await this.service.CommonPost({"name_code_filter": value},"v1/Product/GlobalNameFilter");    
    this.resetFilterForm(false);
    this.productSuggestions = res;
    
    console.log('res',res)
    // this.searchText$.next(value);    
  }

  searchProductSelect(event: AutoCompleteSelectEvent) {
    console.log(event.value)
    this.productList = [event.value];
    this.productTotalCount = 1;
  }

  searchProductClear(event: Event) {
    this.productList = [];
    this.productTotalCount = 0;
    this.filterProduct();
  }

  formHasValue() {
    const formValue = Object.values(this.filterForm.value);
    return formValue.some(val => val);
  }

  weightRangeValueChange() {
    this.weightFilterSub.next();
  }


//   ShowOutofStockOrder(): boolean
//    {
//     const company = this.CompanyList?.find(com => com.out_of_stock_product_order == false);
//     const productInStock = this.productList?.some(product => product.stock > 0);
    
//     if (company && productInStock) {
//         return true;
//     }

//     const outOfStockCompany = this.CompanyList?.find(com => com.out_of_stock_product_order == true);
//     if (outOfStockCompany) {
//         return true;
//     }
    
//     return false;
// }

// ShowOutofStockOrder(): boolean {
//   const company = this.CompanyList[0].out_of_stock_product_order;
//   const productInStock = this.productList?.some(product => product.stock > 0);
  
//   // If company doesn't allow out of stock orders and there's stock, show the button
//   if (company && productInStock) {
//       return true;
//   }

//   // If the company allows out of stock orders, always show the button
//   const outOfStockCompany = this.CompanyList?.find(com => com.out_of_stock_product_order == true);
//   if (outOfStockCompany) {
//       return true;
//   }
  
//   return false;
// }
}

