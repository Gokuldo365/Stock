export class AuditLogModel {
    take: number;
    skip: number;
    keyword: string;
    action: string;
    user_id: string;
    module: string;
    start_date: string;
    end_date: string;
}