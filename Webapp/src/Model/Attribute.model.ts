export class AttributeModel {
    id: number;
    status: boolean = false;;
    name:	string;
    display_order:	number;
}

export class AttributeDetailModel {
    id : number;
    status : boolean = false;
    attribute_id:	string
    name:	string
    att_type:	string;
    att_prefix:	string;
    att_value:	string;
    att_suffix:	string;
    display_order:	number;
}