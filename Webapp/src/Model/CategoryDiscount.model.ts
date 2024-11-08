export class CategoryDiscountModel {
    id: number;
    status: boolean;
    name : string = "";
    category_id : number;
    start_date : Date
    end_date : Date;
    discount_type : string = "";
    discount_amount : number;
    maximum_amount : number;

}
