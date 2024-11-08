export class ProductModel {
    id: number;
    status: boolean;
    name: string = "";
    product_code: string = "";
    product: string = "";
    category_id: number;
    purity_id: number;
    metal_id: number;
    description: string = "";
    display_order: string | number ;
    is_active: boolean = false;
    product_type: string;
    mixed_material_ids : any;
    unit_of_measurement_id : string = "";
}

export class ProductAttributeModel {
    id: number;
    status: boolean = false;
    product_id: number;
    variant_id: number;
    variant_detail_ids: number;
}
