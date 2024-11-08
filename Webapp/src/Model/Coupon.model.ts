export class CouponModel {
    id: number;
    status: boolean;
    title : string = "";
    code : string = "";
    start_date : Date
    end_date : Date;
    min_purchase : number;
    max_discount : number;
    discount : string = "";
    discount_type : string = "";
    coupon_type : string = "";
    limit : number;
    customer_id : number;

}
