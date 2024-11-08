export class ChangePasswordModel {
    id: number;
    status: boolean;
    old_password: string;
    password: string;
    confirm_password: string;
}