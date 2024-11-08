export class CustomerModel {
    id: number;
    status: boolean;
    business_category_id : string = "";
    business_name: string;
    email: string;
    mobile_no: string;
    address: string;
    display_order: string | number ;
}