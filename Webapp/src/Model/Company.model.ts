export class CompanyModel {
    id: number;
    status: boolean;
    name: string;
    address: string;
    country_id: string;
    currency_id: string;
    postal_code: string;
    email: string;
    website: string;
    uen_no:	string;
    bank_name: string;
    bank_acct_no: string;
    telephone_no: string;
    fax_no:	string;
    out_of_stock_product_order: boolean = false;
}
