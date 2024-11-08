export class EmployeeModel {
    id: number = 0;
    status: boolean;
    first_name:	string;
    last_name:	string;
    email:	string;
    mobile_number:	string;
    display_order: string | number;
    password: string;
    user_role_id: string;
    confirm_password : string = "";

}