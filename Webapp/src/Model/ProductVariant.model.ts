export class ProductVariantModel {
    id: number;
    status: boolean = false;;
    name : string = "";
}

export class ProductVariantDetailModel {
    id : number;
    status : boolean = false;
    product_id : number = 0;
    name : string = "";
    product_variant_id : string = "";
}