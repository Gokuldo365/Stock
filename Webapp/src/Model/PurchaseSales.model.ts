export class PurchaseSalesModel {
    id: number;
    status: boolean;
    stock_number: string = "";
    stock_entry_type : string = "";
    stock_entry_date_time : Date;
    hand_over_id : string = "";
    received_by_id : string = "";
    metal_id : string = "";
    purity_id : string = "";
    note : string = "";
    business_from_id : string = "";
    business_to_id : string = "";
}


export class PurchaseDetailModel {
    id: number;
    status: boolean;
    category_id : string = "";
    stock_entry_id : string = "";
    product_id : string = "";
    product_variants_id : string = "";
    combination : string = "";
    stock_qty : number = 0;
    gross_weight : number = 0;
    other_weight : number = 0;
    net_weight : number = 0;
    other_charges : number = 0;
    melting : number = 0;
    wastage : number = 0;
    fine_weight : number = 0;
    mc_amount : number = 0;
}