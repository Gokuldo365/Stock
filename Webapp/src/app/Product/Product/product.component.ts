import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModuleData } from 'src/Helper/Modules';
import { CommonHelper } from 'src/Helper/CommonHelper';
import { CommonService } from 'src/Service/Common.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';;
import { FloatLabelModule } from 'primeng/floatlabel';
import { EditorModule } from 'primeng/editor';
import { StickyPageHeaderComponent } from 'src/app/Shared/sticky-page-header/sticky-page-header.component';
import { MTemplateDirective } from 'src/Directives/template.directive';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { ProductAttributeModel, ProductModel } from 'src/Model/Product.model';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { InwardTypeEnum } from 'src/Helper/Enum/ProductEnum';
import { FileUploaderComponent } from 'src/app/Shared/file-uploader/file-uploader.component';
import { OrderListModule } from 'primeng/orderlist';
@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
})

export class ProductComponent implements OnInit {
    @ViewChild('fileUpload') fileUpload: FileUpload;

    headerPinned: boolean = false;
    ProductId: any = 0;
    ProductData: ProductModel = new ProductModel();
    ProductForm: FormGroup;
    CategoryList: any = [];
    SubCategoryList: any = [];
    ProductAttributeList: any = [];
    ProductAttributeDialouge: boolean = false;
    ProductAttributeForm: FormGroup;
    ProductAttributeId: number = 0;
    ProductAttributeData: ProductAttributeModel = new ProductAttributeModel();
    VariantList: any = [];
    PurityList: any = [];
    VariantDetailList: any = [];
    SelectedVariantOptions: any = [];
    selectedAttributes: any = [];
    SelectedCombinations: any = [];
    ProductTypeList: any = [];
    imageList: any = [];
    VariantSaveData: any = {};
    // MetalDropdown : any = [];
    CombinationList: any = [];
    imageForm: FormGroup = this.formbuilder.group({
        product_id: ['', Validators.required],
        image: [''],
    });
    MixedMaterialDropdown: any = [];
    SelectedMixedMaterial: any = [];
    UnitOfMeasurementDropdown: any = [];
    ImageUrl: string = "";
    FormFileData: any;
    IsUsed: any = false;
    CategoryDropdown: any = [];
    MetalDropdown: any = [];
    PurityDropdown: any = [];
    get imageFC() {
        return this.imageForm.controls;
    }

    constructor(
        public helper: CommonHelper,
        private service: CommonService,
        private formbuilder: FormBuilder,
        private route: ActivatedRoute,
    ) { }

    async ngOnInit() {
        this.helper.ShowSpinner();
        this.ProductId = this.route.snapshot.params["product_id"];
        this.IsUsed = this.helper.Decrypt(this.route.snapshot.params["type"]);
        if (this.IsUsed == '1') {
            this.IsUsed = true;
        }
        else {
            this.IsUsed = false;
        }
        this.ProductFormValidation();
        // await this.GetCategoryList();
        await this.GetMetalList();
        // await this.GetPurityList();
        await this.GetMixedMaterialList();
        await this.GetUOMList();
        await this.GetProductTypeList();
        await this.GetVariantList();
        await this.GetProductById();
        // await this.GetProductImageById();
        this.helper.HideSpinner();
    }

    ProductFormValidation() {
        this.ProductForm = this.formbuilder.group({
            category_id: new FormControl('', Validators.compose([Validators.required])),
            metal_id: new FormControl('', Validators.compose([Validators.required])),
            purity_id: new FormControl('', Validators.compose([Validators.required])),
            name: new FormControl('', Validators.compose([Validators.required])),
            product_code: new FormControl('', Validators.compose([Validators.required])),
            description: new FormControl('', Validators.compose([Validators.required])),
            display_order: new FormControl('', Validators.compose([Validators.nullValidator])),
            stock_qty: new FormControl('', Validators.compose([Validators.nullValidator])),
            low_stock_qty: new FormControl('', Validators.compose([Validators.nullValidator])),
            product_type: new FormControl('', Validators.compose([Validators.required])),
            mixed_material_ids: new FormControl('', Validators.compose([Validators.nullValidator])),
            unit_of_measurement_id: new FormControl('', Validators.compose([Validators.required])),
        });
    }

    ProductValidationMessages = {
        'category_id': [{ type: 'required', message: 'Required.' },],
        'metal_id': [{ type: 'required', message: 'Required.' },],
        'purity_id': [{ type: 'required', message: 'Required.' },],
        'name': [{ type: 'required', message: 'Required.' },],
        'product_code': [{ type: 'required', message: 'Required.' },],
        'description': [{ type: 'required', message: 'Required.' },],
        'product_type': [{ type: 'required', message: 'Required.' },],
        'display_order': [{ type: "required", message: "Please enter display order." }],
        'unit_of_measurement_id': [{ type: 'required', message: 'Required.' },],
    };

    ProductAttributeFormValidation() {
        this.ProductAttributeForm = this.formbuilder.group({
            variant_id: new FormControl('', Validators.compose([Validators.required])),
            variant_detail_ids: new FormControl('', Validators.compose([Validators.required])),
        });
    }

    AttributeValidationMessage = {
        'variant_id': [{ type: 'required', message: 'Required.' },],
        'variant_detail_ids': [{ type: 'required', message: 'Required.' },],
    }

    // async GetCategoryList() {
    //     this.helper.ShowSpinner();
    //     const res = await this.service.GetAll('v1/Category/GetAllCatagoryList');
    //     if (res.length > 0) {
    //         this.CategoryList = res;
    //     }
    //     this.helper.HideSpinner();
    // }

    // async GetMetalList() {
    //     this.helper.ShowSpinner();
    //     const res = await this.service.GetAll('v1/Metal/List');
    //     this.MetalDropdown = res;
    //     this.helper.HideSpinner();
    // }

    // async GetPurityList($event) {
    //     this.helper.ShowSpinner();
    //     const res = await this.service.GetAll('v1/Purity/List');
    //     this.PurityList = res.filter(o=> o.metal_id == $event);
    //     this.helper.HideSpinner();
    // }

    async GetMixedMaterialList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll('v1/MixedMaterial/List');
        for (const obj of res) {
            obj["display_order"] = "";
        }
        this.MixedMaterialDropdown = res;
        this.helper.HideSpinner();
    }

    async GetUOMList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll('v1/UnitOfMeasurement/List');
        if (res?.length > 0) {
            this.UnitOfMeasurementDropdown = res;
        }
        else {
            this.UnitOfMeasurementDropdown = [];
        }
        this.helper.HideSpinner();
    }

    async GetProductTypeList() {
        this.helper.ShowSpinner();
        let res = await this.helper.ConvertEnumToArray(InwardTypeEnum);
        this.ProductTypeList = res;
        this.helper.HideSpinner();
    }

    async GetProductById() {
        this.helper.ShowSpinner();
        if (this.ProductId != 0) {
            const res = await this.service.GetById(this.ProductId, "v1/Product/ById");
            this.ProductData = res;
            this.ProductForm.get('display_order').addValidators(Validators.required);
            await this.GetPurityList(this.ProductData.metal_id);
            await this.GetMixedMaterialByProduct();
            if (this.ProductData.product_type == "AP") {
                await this.GetCombinationsByProductId(this.ProductId);
            }
            this.GetImagesByProductId(this.ProductData.id);
        }
        else {
            this.ProductData = new ProductModel();
        }
        this.helper.HideSpinner();
    }

    async GetCombinationsByProductId(productId) {
        this.helper.ShowSpinner();
        let res = await this.service.GetById(productId, "v1/ProductVariants/ProductVariantsListBy");
        if (res.length > 0) {
            this.CombinationList = res;
        }
        else {
            this.CombinationList = [];
        }
        this.helper.HideSpinner();
    }

    async GetMixedMaterialByProduct() {

        this.helper.ShowSpinner();
        let res = await this.service.GetAll(`v1/Product/MixedMaterialBy/${this.ProductId}`);
        if (res?.length > 0) {
            this.ProductData.mixed_material_ids = res.map(o => o.mixed_material_id);
            this.SelectedMixedMaterial = this.MixedMaterialDropdown.filter(o => this.ProductData.mixed_material_ids.includes(o.id));
            this.MixedMaterialDropdown.forEach(material => {
                let mixedMaterial = res.find(mixed => mixed.mixed_material_id === material.id);
                if (mixedMaterial) {
                    material.display_order = mixedMaterial.display_order.toString();
                }
            });
        }
        else {
            this.ProductData.mixed_material_ids = [];
        }
        this.helper.HideSpinner();
    }


    async GetAttributesByproductId(productId: any) {
        this.helper.ShowSpinner();
        this.ProductAttributeList = [];
        let res = await this.service.GetById(productId, "v1/ProductAttribute/ByAttributeListByProductId");
        if (res.length > 0) {
            for (let obj of res) {
                let nameList: string[] = [];
                for (let item of obj.product_variant_ids) {

                    let variant = this.VariantList.find(o => o.id === item);
                    if (variant) {
                        nameList.push(variant.name);
                    }
                }
                if (nameList.length > 0) {
                    this.ProductAttributeList.push({
                        id: obj.id,
                        name: nameList.join(",")
                    });
                }
            }
            console.log(this.ProductAttributeList);

            // this.ProductAttributeList = this.VariantList.map(o => o.id).includes(res.product_variant_ids);

            // this.ProductAttributeList = res;
        }
        this.helper.HideSpinner();
    }

    async SaveOrUpdateProduct() {
        let SelectedData: any = [];
        if (this.ProductForm.valid) {
            this.helper.ShowSpinner();
            let res: any;
            let SaveData: any = {};
            SaveData.mixed_material_ids = [];
            SaveData.category_id = this.ProductData.category_id;
            SaveData.metal_id = this.ProductData.metal_id;
            SaveData.purity_id = this.ProductData.purity_id;
            SaveData.product_type = this.ProductData.product_type;
            SaveData.name = this.ProductData.name;
            SaveData.product_code = this.ProductData.product_code;
            SaveData.description = this.ProductData.description;
            SaveData.display_order = this.ProductData.display_order;
            SaveData.unit_of_measurement_id = this.ProductData.unit_of_measurement_id;
            if (this.SelectedMixedMaterial?.length > 0) {
                for (const obj of this.SelectedMixedMaterial) {
                    SaveData.mixed_material_ids.push({
                        mixed_materail_id: obj.id,
                        display_order: Number(obj.display_order)
                    })
                }
            }
            if (this.ProductId == 0) {
                res = await this.service.CommonPost(SaveData, 'v1/Product/Insert');
            }
            else {
                res = await this.service.CommonPut(SaveData, `v1/Product/Update/${this.ProductId}`);
            }
            if (res.Type == "S") {
                // this.helper.redirectTo("/Product/" + (res.AddtionalData ?? this.ProductId) + '/' + this.helper.Encrypt(this.IsUsed));
                const productIdToUse = res.AddtionalData ?? this.ProductId;

                if (productIdToUse) {
                    this.helper.redirectTo("/Product/" + productIdToUse + '/' + this.helper.Encrypt(this.IsUsed));
                    setTimeout(() => {
                        window.location.reload();
                    }, 1);
                }
                this.helper.SucessToastr(res.Message);
                // this.helper.HideSpinner();
            }
            else {
                this.helper.HideSpinner();
                this.helper.ErrorToastr(res.Message);
            }
        }
        else {
            this.helper.validateAllFormFields(this.ProductForm)
        }
    }

    async UpdateProductMixedMaterial() {
        this.helper.ShowSpinner();
        let SaveData: any = {};
        let res: any;
        SaveData.product_id = this.ProductId;
        SaveData.mixedMaterial = [].concat.apply([], this.SelectedMixedMaterial.map(o => o.id));
        res = await this.service.CommonPost(SaveData, 'ProductMixedMaterial/Insert');
        if (res.Type == "S") {
            this.helper.SucessToastr(res.Message);
        }
        else {
            this.helper.ErrorToastr(res.Message);
        }
        this.helper.HideSpinner();
    }

    Cancel() {
        this.ProductData = new ProductModel();
        this.helper.redirectTo('ProductList');
    }

    onUpload(event: any) {

    }


    async AddOrEditAttribute(id: number) {
        this.helper.ShowSpinner();
        // this.ProductAttributeFormValidation();
        this.ProductAttributeId = id;
        if (this.ProductAttributeId != 0) {
            const res = await this.service.GetById(this.ProductAttributeId, 'v1/ProductAttribute/ById');
            if (res) {
                this.ProductAttributeData = res;
                this.selectedAttributes = res.product_variant_ids;
                this.GetVariantDetailList(this.selectedAttributes);
                this.SelectedCombinations = res.combination;
            }
        }
        else {
            this.ProductAttributeData = new ProductAttributeModel();
            this.VariantDetailList = [];
            this.SelectedCombinations = [];
            this.selectedAttributes = [];
        }
        this.ProductAttributeDialouge = true;
        this.helper.HideSpinner();
    }

    async GetVariantList() {
        this.helper.ShowSpinner();
        const res = await this.service.GetAll('v1/Attribute/List');
        if (res?.length > 0) {
            this.VariantList = res;
        }
        else {
            this.VariantList = [];
        }
        this.helper.HideSpinner();
    }

    async GetVariantDetailList($event) {
        let data: any[];
        this.SelectedVariantOptions = [];
        data = $event;
        this.helper.ShowSpinner();
        this.VariantDetailList = [];
        for (let obj of data) {
            let res = await this.service.GetAll(`v1/AttributeDetail/ByAttributeId/${obj}`);
            if (res.length > 0) {
                const filteredData = res.filter(item => item.attribute_id === obj);
                let objData = filteredData.map(item => ({
                    name: item.attribute_name,
                    attribute_detail_name: item.attribute_detail_name,
                    variant_id: 0,
                    attribute_id: item.attribute_id,
                    attribute_detail_id: item.attribute_detail_id,
                    display_order: item.display_order
                }));

                this.SelectedVariantOptions.push(...objData);
                // this.SelectedVariantOptions = VariantListData;
            }

            const groupedData = this.SelectedVariantOptions.reduce((acc, item) => {
                if (!acc[item.name]) {
                    acc[item.name] = [];
                }
                acc[item.name].push({ 'value': item.attribute_detail_name, 'attribute_id': item.attribute_id, 'attribute_detail_id': item.attribute_detail_id });
                return acc;
            }, {});
            const combinations = this.getCombinations(groupedData);
            if (combinations.length > 0) {
                if (combinations[0].value != '') {
                    this.VariantDetailList = combinations;
                }
            }

        }
        this.helper.HideSpinner();
    }

    getCombinations(groups) {
        const keys = Object.keys(groups);
        const combinations = [];
        let i: number = 1;
        function combine(prefix, preattribute, preattribute_detail, index) {
            if (index === keys.length) {
                combinations.push({
                    'value': prefix.join('-'),
                    'attribute_ids': preattribute,
                    'attribute_detail_ids': preattribute_detail
                });
                return;
            }
            const key = keys[index];
            groups[key].forEach(value => {
                combine([...prefix, value.value], [...preattribute, value.attribute_id], [...preattribute_detail, value.attribute_detail_id], index + 1);
            });
        }

        combine([], [], [], 0);
        return combinations;
    }

    SelectedCombinationChangeEvent(data: any, is_update: boolean) {
        this.VariantSaveData = {};
        this.VariantSaveData['product_id'] = this.ProductData.id;
        this.VariantSaveData['combination'] = this.VariantDetailList;
        this.VariantSaveData['display_order'] = 0;
        console.log(this.SelectedCombinations);
    }

    async SaveOrUpdateAttribute() {
        this.helper.ShowSpinner();
        let res: any;
        this.VariantSaveData = {};
        this.VariantSaveData['product_id'] = this.ProductData.id;
        this.VariantSaveData['combination'] = this.VariantDetailList;
        this.VariantSaveData['display_order'] = 0;
        if (!this.ProductAttributeData.id) {
            res = await this.service.CommonPost(this.VariantSaveData, 'v1/ProductVariants/Insert');
        }
        else {
            res = await this.service.CommonPut(this.VariantSaveData, `v1/Variant/Update/${this.ProductId}`);
        }
        if (res.Type == "S") {
            // await this.GetAttributesByproductId(this.ProductId);
            // await this.ProductVariantDetailSave(res.AddtionalData)
            this.helper.HideSpinner();
            this.helper.SucessToastr(res.Message);
            this.ProductAttributeDialouge = false;
            await this.GetCombinationsByProductId(this.ProductId);
        }
        else {
            this.helper.HideSpinner();
            this.helper.ErrorToastr(res.Message);
        }

    }

    async ProductVariantDetailSave(Data) {
        let res: any;
        let SaveData: any = [];
        for (let obj of Data) {
            SaveData = this.SelectedVariantOptions.map(o => ({
                variant_id: obj,
                attribute_id: o.attribute_id,
                attribute_detail_id: o.attribute_detail_id,
                display_order: o.display_order
            }));
        }

        if (SaveData) {
            res = await this.service.CommonPost({ 'data': SaveData }, 'v1/ProductVariantDetail/Insert');
        }
        if (res.Type == "S") {
            return res.Type;
        }
        else {
            return res.Type;
        }
        this.helper.HideSpinner();
    }

    GetImage(event) {
        let file = event.target.files[0];
        this.FormFileData = file;
        this.ImgUpload(file);
    }

    ImgUpload(file) {
        let fileReader = new FileReader();
        let arrayBuffer: any;
        fileReader.onload = (e) => {
            arrayBuffer = fileReader.result;
            var b64 = arrayBuffer;
            this.ImageUrl = b64;
        }
        if (file) {
            fileReader.readAsDataURL(file);
            this.ImageUrl = file;
        }
    }

    async saveOrUpdateImages() {
        try {
            console.log(this.imageForm.get('image').value);
            let formData = new FormData();
            // Loop through the images and append each file to a single FormData instance
            for (let obj of this.imageForm.get('image').value) {

               let Data : any = await this.GetImagesByProductId(this.ProductId)
               if(Data?.length > 0){
                let NewImageCount = Data.length + 1;
                let filedata = this.base64ToFile(obj, `Product-${this.ProductId}-${NewImageCount}.png`);
                if (filedata) {
                    formData.append('files', filedata);
                }
               }
               else{
                let filedata = this.base64ToFile(obj, `Product-${this.ProductId}.png`);
                if (filedata) {
                    formData.append('files', filedata);
                }
               }

            }

            // Append additional data if necessary
            formData.append('product_id', String(this.ProductId));

            // Send the FormData in one request
            let res = await this.service.UploadPost(formData, `v1/ProductImage/UploadFiles/${this.ProductId}`);

            if (res.Type == "S") {
                this.helper.SucessToastr(res.Message);
            } else {
                this.helper.ErrorToastr(res.Message);
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            this.helper.ErrorToastr('An error occurred while uploading images.');
        }
    }

    async GetImagesByProductId(ProductId) {
        this.helper.ShowSpinner();

        let res = await this.service.GetAll(`v1/ProductImage/GetImagesByProductId/${ProductId}`);
        if (res?.length > 0) {
            this.ImageUrl = res.map(o => o.file_name);
        }
        this.helper.HideSpinner();
        return res;
    }

    base64ToFile(base64String: string, fileName: string): File {
        const base64Data = base64String.split(',')[1];
        const binaryString = atob(base64Data);
        const len = binaryString.length;
        const uint8Array = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
        }
        const mimeType = base64String.split(',')[0].match(/:(.*?);/)[1];
        return new File([uint8Array], fileName, { type: mimeType });
    }


    async GetMetalList() {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll("v1/Metal/List");
        if (res?.length > 0) {
            this.MetalDropdown = res;
        }
        else {
            this.MetalDropdown = [];
        }
        this.helper.HideSpinner();
    }

    async GetPurityList($event) {
        this.helper.ShowSpinner();
        let metal_id = $event;
        let res = await this.service.GetAll("v1/Purity/List");
        if (res?.length > 0) {
            this.PurityDropdown = res.filter(o => o.metal_id == metal_id);
            await this.GetCategoryList(metal_id)
        }
        else {
            this.PurityDropdown = [];
        }
        this.helper.HideSpinner();
    }

    async GetCategoryList(metal_id: string) {
        this.helper.ShowSpinner();
        let res = await this.service.GetAll('v1/Category/GetAllCatagoryList');
        if (res?.length > 0) {
            this.CategoryDropdown = res.filter(o => o.metal_id == metal_id);
            // await this.GetProductList(metal_id);
        }
        else {
            this.CategoryDropdown = [];
        }
        this.helper.HideSpinner();
    }




    CancelAttribute() {
        this.ProductAttributeData = new ProductAttributeModel();
        this.ProductAttributeDialouge = false;
    }


}

const routes: Routes = [
    { path: "", component: ProductComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductRoutingModule { }

@NgModule({
    declarations: [ProductComponent],
    imports: [
        CommonModule,
        ProductRoutingModule,
        ModuleData,
        DropdownModule,
        TableModule,
        ButtonModule,
        CardModule,
        InputTextModule,
        FloatLabelModule,
        EditorModule,
        StickyPageHeaderComponent,
        MTemplateDirective,
        DialogModule,
        TabViewModule,
        PanelModule,
        DropdownModule,
        FileUploadModule,
        MultiSelectModule,
        CheckboxModule,
        FileUploaderComponent,
        OrderListModule
    ],
})
export class ProductModule { }
