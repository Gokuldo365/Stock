import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './Shared/layout/layout.component';
import { AuthGuard } from '../Helper/AuthGuard';
const routes: Routes = [
  {
    path: "",
    redirectTo: "/Login",
    pathMatch: "full"
  },
  {
    path: "Login",
    loadChildren: () => import('./Login/login.component').then(o => o.LoginModule)
  },

  {
    canActivate: [AuthGuard],
    path: "Dashboard",
    component: LayoutComponent, loadChildren: () => import('./Dashboard/dashboard.component').then(o => o.DashboardModule),
    data: { MenuName: "Dashboard", Module: "Admin" }
  },
  // {
  //   canActivate: [AuthGuard],
  //   path: "ProductVariantList",
  //   component: LayoutComponent, loadChildren: () => import('./ProductVariant/ProductVariantList/product-variant-list.component').then(o => o.ProductVariantListModule),
  //   data: { MenuName: "ProductVariantList", Module: "Admin" }
  // },
  // {
  //   canActivate: [AuthGuard],
  //   path: "ProductVariant/:variant_id", component: LayoutComponent,
  //   loadChildren: () => import('./ProductVariant/ProductVariant/product-variant.component').then(o => o.ProductVariantModule),
  //   data: { MenuName: "ProductVariantList", Module: "Admin" }
  // },

  {
    canActivate: [AuthGuard],
    path: "AttributeList",
    component: LayoutComponent, loadChildren: () => import('./Attribute/AttributeList/attributelist.component').then(o => o.AttributeListModule),
    data: { MenuName: "AttributeList", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "Attribute/:id/:type",
    component: LayoutComponent, loadChildren: () => import('./Attribute/AttributeForm/attribute.component').then(o => o.AttributeModule),
    data: { MenuName: "Attribute", Module: "Admin" }
  },
  
  {
    canActivate: [AuthGuard],
    path: "Country",
    component: LayoutComponent, loadChildren: () => import('./Country/country.component').then(o => o.CountryModule),
    data: { MenuName: "Country", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "Country/:country_id",
    component: LayoutComponent, loadChildren: () => import('./Country/country.component').then(o => o.CountryModule),
    data: { MenuName: "Country", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "Currency",
    component: LayoutComponent, loadChildren: () => import('./Currency/currency.component').then(o => o.CurrencyModule),
    data: { MenuName: "Currency", Module: "Admin" }
  },

  {
    canActivate: [AuthGuard],
    path: "UserRole",
    component: LayoutComponent, loadChildren: () => import('./UserRole/user-role.component').then(o => o.UserRoleModule),
    data: { MenuName: "UserRole", Module: "Admin" }
  },

  {
    canActivate: [AuthGuard],
    path: "User",
    component: LayoutComponent, loadChildren: () => import('./User/user.component').then(o => o.UserModule),
    data: { MenuName: "User", Module: "Admin" }
  },
  {
    // canActivate: [AuthGuard],
    path: "CategoryList",
    component: LayoutComponent, loadChildren: () => import('./Category/CategoryList/categoryList.component').then(o => o.CategoryListModule),
    data: { MenuName: "CategoryList", Module: "Admin" }
  },
  {
    // canActivate: [AuthGuard],
    path: "Category/:id/:type",
    component: LayoutComponent, loadChildren: () => import('./Category/CategoryForm/categoryform.component').then(o => o.CategoryFormModule),
    data: { MenuName: "Category", Module: "Admin" }
  },
  {
    // canActivate: [AuthGuard],
    path: "SubCategoryList",
    component: LayoutComponent, loadChildren: () => import('./SubCategory/SubCategoryList/subcategorylist.component').then(o => o.SubCategoryListModule),
    data: { MenuName: "SubCategoryList", Module: "Admin" }
  },
  {
    // canActivate: [AuthGuard],
    path: "SubCategory/:id",
    component: LayoutComponent, loadChildren: () => import('./SubCategory/SubCategoryForm/subcategoryform.component').then(o => o.SubCategoryFormModule),
    data: { MenuName: "SubCategoryList", Module: "Admin" }
  },
  {    
    path: "product-catalog",        
    loadComponent: () => import('./product-catalog/product-catalog.component').then(o => o.ProductCatalogComponent),
    data: { MenuName: "product-catalog", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "ProductList",
    component: LayoutComponent, loadChildren: () => import('./Product/ProductList/product-list.component').then(o => o.ProductListModule),
    data: { MenuName: "ProductList", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "Product/:product_id/:type", component: LayoutComponent,
    loadChildren: () => import('./Product/Product/product.component').then(o => o.ProductModule),
    data: { MenuName: "ProductList", Module: "Admin" }
  },
  
  {
    canActivate: [AuthGuard],
    path: "Metal/:metal_id",
    component: LayoutComponent, loadChildren: () => import('./Metal/metal.component').then(o => o.MetalModule),
    data: { MenuName: "Metal", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "Metal",
    component: LayoutComponent, loadChildren: () => import('./Metal/metal.component').then(o => o.MetalModule),
    data: { MenuName: "Metal", Module: "Admin" }
  },

  {
    canActivate: [AuthGuard],
    path: "Purity/:Purity_id",
    component: LayoutComponent, loadChildren: () => import('./Purity/purity.component').then(o => o.PurityModule),
    data: { MenuName: "Purity", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "Purity",
    component: LayoutComponent, loadChildren: () => import('./Purity/purity.component').then(o => o.PurityModule),
    data: { MenuName: "Purity", Module: "Admin" }
  },

  {
    canActivate: [AuthGuard],
    path: "MixedMaterial/:mixedmaterial_id",
    component: LayoutComponent, loadChildren: () => import('./MixedMaterial/mixedmaterial.component').then(o => o.MixedMaterialModule),
    data: { MenuName: "MixedMaterial", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "MixedMaterial",
    component: LayoutComponent, loadChildren: () => import('./MixedMaterial/mixedmaterial.component').then(o => o.MixedMaterialModule),
    data: { MenuName: "MixedMaterial", Module: "Admin" }
  },

  {
    canActivate: [AuthGuard],
    path: "UnitOfMeasurement/:unitofmeasurement_id",
    component: LayoutComponent, loadChildren: () => import('./UnitofMeasurement/unitofmeasurement.component').then(o => o.UnitofMeasurementModule),
    data: { MenuName: "UnitOfMeasurement", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "UnitOfMeasurement",
    component: LayoutComponent, loadChildren: () => import('./UnitofMeasurement/unitofmeasurement.component').then(o => o.UnitofMeasurementModule),
    data: { MenuName: "UnitOfMeasurement", Module: "Admin" }
  },

  {
    canActivate: [AuthGuard],
    path: "Employee/:Employee_id",
    component: LayoutComponent, loadChildren: () => import('./Employee/employee.component').then(o => o.EmployeeModule),
    data: { MenuName: "Employee", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "Employee",
    component: LayoutComponent, loadChildren: () => import('.//Employee/employee.component').then(o => o.EmployeeModule),
    data: { MenuName: "Employee", Module: "Admin" }
  },
  
  {
    canActivate: [AuthGuard],
    path: "Business/:Customer_id",
    component: LayoutComponent, loadChildren: () => import('./Customer/customer.component').then(o => o.CustomerModule),
    data: { MenuName: "Business", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "Business",
    component: LayoutComponent, loadChildren: () => import('./Customer/customer.component').then(o => o.CustomerModule),
    data: { MenuName: "Business", Module: "Admin" }
  },

  {
    canActivate: [AuthGuard],
    path: "OrderList",
    component: LayoutComponent, loadChildren: () => import('./Order/OrderList/order-list.component').then(o => o.OrderListModule),
    data: { MenuName: "OrderList", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "Order/:order_id", component: LayoutComponent,
    loadChildren: () => import('./Order/Order/order.component').then(o => o.OrderModule),
    data: { MenuName: "OrderList", Module: "Admin" }
  },

  {
    // canActivate: [AuthGuard],
    path: "StockInward/:inward_id",
    component: LayoutComponent, loadChildren: () => import('./StockInward/StockInwardForm/stock-inward-form.component').then(o => o.StockInWardFormModule),
    data: { MenuName: "StockInward", Module: "Admin" }
  },
  {
    // canActivate: [AuthGuard],
    path: "StockInwardList",
    component: LayoutComponent, loadChildren: () => import('./StockInward/StockInwardList/stock-inward-list.component').then(o => o.StockInwardListModule),
    data: { MenuName: "StockInward", Module: "Admin" }
  },

  {
    // canActivate: [AuthGuard],
    path: "StockOutWard/:outward_id",
    component: LayoutComponent, loadChildren: () => import('./StockOutWard/StockOutwardForm/stock-outward-form.component').then(o => o.StockOutWardFormModule),
    data: { MenuName: "StockOutWard", Module: "Admin" }
  },
  {
    // canActivate: [AuthGuard],
    path: "StockOutWardList",
    component: LayoutComponent, loadChildren: () => import('./StockOutWard/StockOutwardList/stock-outward-list.component').then(o => o.StockOutwardListModule),
    data: { MenuName: "StockOutWard", Module: "Admin" }
  },

  {
    // canActivate: [AuthGuard],
    path: "CheckOut",
    component: LayoutComponent, loadChildren: () => import('./CheckOut/check-out.component').then(o => o.CheckOutModule),
    data: { MenuName: "CheckOut", Module: "Admin" }
  },

  {
    canActivate: [AuthGuard],
    path: "StockReport",
    component: LayoutComponent, loadChildren: () => import('./StockReport/stock-report.component').then(o => o.StockReportModule),
    data: { MenuName: "Stock Report", Module: "Admin" }
  },

  {
    canActivate: [AuthGuard],
    path: "ItemLedger",
    component: LayoutComponent, loadChildren: () => import('./StockLedger/stock-ledger.component').then(o => o.StockLedgerModule),
    data: { MenuName: "Stock Ledger", Module: "Admin" }
  },

  {
    canActivate: [AuthGuard],
    path: "BusinessLedger",
    component: LayoutComponent, loadChildren: () => import('./BusinessLedger/business-ledger.component').then(o => o.BusinessLedgerModule),
    data: { MenuName: "Business Ledger", Module: "Admin" }
  },

  {
    canActivate: [AuthGuard],
    path: "BusinessCategory",
    component: LayoutComponent, loadChildren: () => import('./BusinessCategory/business-category.component').then(o => o.BusinessCategoryModule),
    data: { MenuName: "BusinessCategory", Module: "Admin" }
  },

  {
    canActivate: [AuthGuard],
    path: "BusinessCategory/:BusinessCategory_id",
    component: LayoutComponent, loadChildren: () => import('./BusinessCategory/business-category.component').then(o => o.BusinessCategoryModule),
    data: { MenuName: "BusinessCategory", Module: "Admin" }
  },

  // New

  {
    canActivate: [AuthGuard],
    path: "ReceiptList",
    component: LayoutComponent, loadChildren: () => import('./Receipt/ReceiptList/receipt-list.component').then(o => o.ReceiptListModule),
    data: { MenuName: "ReceiptList", Module: "Admin" }
  },  
  {
    canActivate: [AuthGuard],
    path: "Receipt/:id/:type", component: LayoutComponent,
    loadChildren: () => import('./Receipt/Receipt/receipt.component').then(o => o.ReceiptModule),
    data: { MenuName: "ReceiptList", Module: "Admin" }
  },

  {
    canActivate: [AuthGuard],
    path: "ReceiptNewList",
    component: LayoutComponent, loadChildren: () => import('./ReceiptNew/ReceiptNewList/receipt-new-list.component').then(o => o.ReceiptNewListModule),
    data: { MenuName: "ReceiptNewList", Module: "Admin" }
  },  
  {
    canActivate: [AuthGuard],
    path: "ReceiptNew/:id", component: LayoutComponent,
    loadChildren: () => import('./ReceiptNew/ReceiptNew/receipt-new.component').then(o => o.ReceiptNewModule),
    data: { MenuName: "ReceiptNewList", Module: "Admin" }
  },

  {
    canActivate: [AuthGuard],
    path: "IssueList",
    component: LayoutComponent, loadChildren: () => import('./Issue/IssueList/issue-list.component').then(o => o.IssueListModule),
    data: { MenuName: "IssueList", Module: "Admin" }
  },  
  {
    canActivate: [AuthGuard],
    path: "Issue/:id/:type", component: LayoutComponent,
    loadChildren: () => import('./Issue/Issue/issue.component').then(o => o.IssueModule),
    data: { MenuName: "IssueList", Module: "Admin" }
  },

  // Old
  {
    canActivate: [AuthGuard],
    path: "PurchaseReceiptList",
    component: LayoutComponent, loadChildren: () => import('./PurchaseReceipt/PurchaseReceipt-List/purchase-receipt-list.component').then(o => o.PurchaseReceiptListModule),
    data: { MenuName: "PurchaseReceiptList", Module: "Admin" }
  },  
  {
    canActivate: [AuthGuard],
    path: "PurchaseReceipt/:id", component: LayoutComponent,
    loadChildren: () => import('./PurchaseReceipt/PurchaseReceipt/purchase-receipt.component').then(o => o.PurchaseReceiptModule),
    data: { MenuName: "ProductList", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "PurchaseIssueList",
    component: LayoutComponent, loadChildren: () => import('./PurchaseIssue/purchase-issue-list/purchase-issue-list.component').then(o => o.PurchaseIssueListModule),
    data: { MenuName: "PurchaseIssueList", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "PurchaseIssue/:id", component: LayoutComponent,
    loadChildren: () => import('./PurchaseIssue/purchase-issue/purchase-issue.component').then(o => o.PurchaseIssueModule),
    data: { MenuName: "ProductList", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "SalesReceiptList",
    component: LayoutComponent, loadChildren: () => import('./sales-receipt/sales-receipt-list/sales-receipt-list.component').then(o => o.SalesReceiptListModule),
    data: { MenuName: "PurchaseReceiptList", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "SalesReceipt/:id", component: LayoutComponent,
    loadChildren: () => import('./sales-receipt/sales-receipt/sales-receipt.component').then(o => o.SalesReceiptModule),
    data: { MenuName: "ProductList", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "SalesIssueList",
    component: LayoutComponent, loadChildren: () => import('./sales-issue/sales-issue-list/sales-issue-list.component').then(o => o.SalesIssueListModule),
    data: { MenuName: "PurchaseIssueList", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "SalesIssue/:id", component: LayoutComponent,
    loadChildren: () => import('./sales-issue/sales-issue/sales-issue.component').then(o => o.SalesIssueModule),
    data: { MenuName: "ProductList", Module: "Admin" }
  },
  // Old
  {
    canActivate: [AuthGuard],
    path: "Company/:company_id",
    component: LayoutComponent, loadChildren: () => import('./Company/companylist.component').then(o => o.CompanyModule),
    data: { MenuName: "Company", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "Company",
    component: LayoutComponent, loadChildren: () => import('./Company/companylist.component').then(o => o.CompanyModule),
    data: { MenuName: "Company", Module: "Admin" }
  },

  {
    canActivate: [AuthGuard],
    path: "Price/:price_id",
    component: LayoutComponent, loadChildren: () => import('./Price/price.component').then(o => o.PriceModule),
    data: { MenuName: "Price", Module: "Admin" }
  },
  {
    canActivate: [AuthGuard],
    path: "Price",
    component: LayoutComponent, loadChildren: () => import('./Price/price.component').then(o => o.PriceModule),
    data: { MenuName: "Price", Module: "Admin" }
  },

  // {
  //   path: "**",
  //   canActivate: [AuthGuard],
  //   component: LayoutComponent,
  //   loadChildren: () => import('./PageNotFound/page-not-found.component').then(o => o.PageNotFoundModule)
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
