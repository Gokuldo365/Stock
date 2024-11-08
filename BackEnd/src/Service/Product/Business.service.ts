import { Injectable } from '@nestjs/common';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { business } from '@Root/Database/Table/Product/business';
import { BusinessModel } from '@Model/Product/Business.model';
import { CommonService } from '../Common.service';
import { stock_entry } from '@Root/Database/Table/Product/stock_entry';

@Injectable()
export class BusinessService {
    constructor(private _CommonService: CommonService) {
    }

    async GetAll() {
        const BusinessList = await business.find({ order: { display_order: 'ASC' } ,relations:['business_category']});

        for (const Data of BusinessList) {
            const IsUsed = await stock_entry.count({
                where: [
                    { business_id: Data.id },
                ]
            }) > 0;

            (Data as any).is_used = IsUsed;
        }

        return BusinessList;
    }

    async GetById(BusinessId: string) {
        const BusinessGetById = await business.findOne({ where: { id: BusinessId }, order:{display_order:'ASC'} });
        if (!BusinessGetById) {
            throw new Error('Record not found')
        }
        return BusinessGetById;
    }

    async Insert(BusinessData: BusinessModel, UserId: string) {
        const _BusinessData = new business();
        _BusinessData.business_name = BusinessData.business_name.trimStart().trimEnd();
        _BusinessData.business_category_id = BusinessData.business_category_id;
        _BusinessData.email = BusinessData.email;
        _BusinessData.mobile_no = BusinessData.mobile_no;
        _BusinessData.address = BusinessData.address;
        const nextDisplayOrder = await this._CommonService.getLastDisplayOrder('business');
        _BusinessData.display_order = nextDisplayOrder;
        _BusinessData.created_by_id = UserId;
        _BusinessData.created_on = new Date();
        await business.insert(_BusinessData);
        return _BusinessData;
    }

    async Update(Id: string, BusinessData: BusinessModel, UserId: string) {
        const BusinessUpdateData = await business.findOne({ where: { id: Id } });
        if (!BusinessUpdateData) {
            throw new Error('Record not found')
        }
        const nextDisplayOrderUpdate = await this._CommonService.getLastDisplayOrderUpdate('business');
        if (BusinessData.display_order > nextDisplayOrderUpdate) {
        throw new Error(`Display order cannot be greater than the current max (${nextDisplayOrderUpdate})`);
        }
        BusinessUpdateData.business_name = BusinessData.business_name.trimStart().trimEnd();
        BusinessUpdateData.business_category_id = BusinessData.business_category_id;
        BusinessUpdateData.email = BusinessData.email;
        BusinessUpdateData.mobile_no = BusinessData.mobile_no;
        BusinessUpdateData.address = BusinessData.address;
        BusinessUpdateData.display_order = BusinessData.display_order;
        BusinessUpdateData.updated_by_id = UserId;
        BusinessUpdateData.updated_on = new Date();
        await business.update(Id, BusinessUpdateData);
        return BusinessUpdateData;
    }

    async Delete(Id: string) {
      const BusinessData = await business.findOne({ where: { id: Id } });
      if (!BusinessData) {
        throw new Error(ResponseEnum.NotFound);
      }
      await BusinessData.remove();
      return true;
    }
}
