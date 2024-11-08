export class CategoryModel {
    id: number;
    status: boolean;
    name: string;
    metal_id: string;
    code: string;
    description: string;
    parent_category_id: any;
    is_stock_category : boolean = false;
    display_order: string | number
}
