export class ProductReviewModel {
    id: number;
    status: boolean;
    product_id : number;
    customer_id : number;
    customer_text_review : string = "";
    replay_text_review : string = "";
    rating : any;
    is_approved : boolean = false;
}
