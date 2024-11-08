import { Injectable } from '@nestjs/common';
import { country } from '@Database/Table/Admin/country';
import { LogActionEnum } from '@Helper/Enum/AuditLogEnum';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { CountryModel } from '@Model/Admin/Country.model';
import { AuditLogService } from '@Service/Admin/AuditLog.service';
import { CacheService } from '@Service/Cache.service';
import { CacheEnum } from '@Helper/Enum/CacheEnum';

@Injectable()
export class CountryService {
  constructor(private _AuditLogService: AuditLogService,
    private _CacheService: CacheService) {
  }

  async GetAll() {
      const CountryList = await country.find({ relations: ["currency"] });
      return CountryList;
    }


  async GetById(CountryId: string) {
      const CountryData = await country.findOne({ relations: ["currency"], where: { id: CountryId } });
      return CountryData;
    }


  async Insert(CountryData: CountryModel, UserId: string) {
    const _CountryData = new country();
    _CountryData.name = CountryData.name;
    _CountryData.code = CountryData.code;
    _CountryData.currency_id = CountryData.currency_id;
    _CountryData.created_by_id = UserId;
    _CountryData.created_on = new Date();
    await country.insert(_CountryData);
    this._AuditLogService.AuditEmitEvent({ PerformedType: country.name, ActionType: LogActionEnum.Insert, PrimaryId: [_CountryData.id] });
    return _CountryData;
  }

  async Update(Id: string, CountryData: CountryModel, UserId: string) {
    const CompanyUpdateData = await country.findOne({ where: { id: Id } });
    if (!CompanyUpdateData) {
      throw new Error('Record not found')
    }
    CompanyUpdateData.name = CountryData.name;
    CompanyUpdateData.code = CountryData.code;
    CompanyUpdateData.currency_id = CountryData.currency_id;
    CompanyUpdateData.updated_by_id = UserId;
    CompanyUpdateData.updated_on = new Date();
    await country.update(Id, CompanyUpdateData);
    this._AuditLogService.AuditEmitEvent({ PerformedType: country.name, ActionType: LogActionEnum.Update, PrimaryId: [CompanyUpdateData.id] });
    return CompanyUpdateData;
  }

  async Delete(Id: string) {
    const CountryData = await country.findOne({ where: { id: Id } });
    if (!CountryData) {
      throw new Error(ResponseEnum.NotFound);
    }
    await CountryData.remove();
    this._AuditLogService.AuditEmitEvent({ PerformedType: country.name, ActionType: LogActionEnum.Delete, PrimaryId: [Id] });
    return true;
  }
}
