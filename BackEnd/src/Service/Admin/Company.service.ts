import { Injectable } from '@nestjs/common';
import { company } from '@Database/Table/Admin/company';
import { LogActionEnum } from '@Helper/Enum/AuditLogEnum';
import { CompanyModel } from '@Model/Admin/Company.model';
import { DataSource } from 'typeorm';
import { AuditLogService } from '@Service/Admin/AuditLog.service';
import { CacheService } from '@Service/Cache.service';
import { CacheEnum } from '@Helper/Enum/CacheEnum';
import { ResponseEnum } from '@Root/Helper/Enum/ResponseEnum';
import { weightSrvRecords } from 'ioredis/built/cluster/util';

@Injectable()
export class CompanyService {
  constructor(
    private _AuditLogService: AuditLogService,
    private _DataSource: DataSource,
    private _CacheService: CacheService
  ) {
  }

  async GetAll() {
      const CompanyData = await company.find({relations:['currency']});
      return CompanyData;
    }


  async Insert(CompanyData: CompanyModel, UserId: string) {
    const _CompanyData = new company();
    _CompanyData.name = CompanyData.name;
    _CompanyData.address = CompanyData.address;
    _CompanyData.country_id = CompanyData.country_id;
    _CompanyData.currency_id = CompanyData.currency_id;
    _CompanyData.postal_code = CompanyData.postal_code;
    _CompanyData.email = CompanyData.email;
    _CompanyData.website = CompanyData.website;
    _CompanyData.uen_no = CompanyData.uen_no;
    _CompanyData.bank_name = CompanyData.bank_name;
    _CompanyData.bank_acct_no = CompanyData.bank_acct_no;
    _CompanyData.telephone_no = CompanyData.telephone_no;
    _CompanyData.fax_no = CompanyData.fax_no;
    _CompanyData.invoice_footer = CompanyData.invoice_footer;
    _CompanyData.out_of_stock_product_order = CompanyData.out_of_stock_product_order;
    _CompanyData.created_by_id = UserId;
    _CompanyData.created_on = new Date();
    await company.insert(_CompanyData);
    return _CompanyData;
  }

  async Update(Id: string, CompanyData: CompanyModel, UserId: string) {
    const CompanyUpdateData = await company.findOne({ where: { id: Id } });
    if (!CompanyUpdateData) {
      throw new Error('Record not found')
    }
    CompanyUpdateData.name = CompanyData.name;
    CompanyUpdateData.address = CompanyData.address;
    CompanyUpdateData.country_id = CompanyData.country_id;
    CompanyUpdateData.currency_id = CompanyData.currency_id;
    CompanyUpdateData.postal_code = CompanyData.postal_code;
    CompanyUpdateData.email = CompanyData.email;
    CompanyUpdateData.website = CompanyData.website;
    CompanyUpdateData.uen_no = CompanyData.uen_no;
    CompanyUpdateData.bank_name = CompanyData.bank_name;
    CompanyUpdateData.bank_acct_no = CompanyData.bank_acct_no;
    CompanyUpdateData.telephone_no = CompanyData.telephone_no;
    CompanyUpdateData.fax_no = CompanyData.fax_no;
    CompanyUpdateData.invoice_footer = CompanyData.invoice_footer;
    CompanyUpdateData.out_of_stock_product_order = CompanyData.out_of_stock_product_order;
    CompanyUpdateData.updated_by_id = UserId;
    CompanyUpdateData.updated_on = new Date();
    await company.update(Id, CompanyUpdateData);
    return CompanyUpdateData;
  }

  async Delete(Id: string) {
    const CompanyData = await company.findOne({ where: { id: Id } });
    if (!CompanyData) {
      throw new Error(ResponseEnum.NotFound);
    }
    await CompanyData.remove();
    return true;
  }
}
