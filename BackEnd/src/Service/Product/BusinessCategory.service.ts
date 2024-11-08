import { Injectable } from '@nestjs/common';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { business_category } from '@Root/Database/Table/Product/business_category';
import { BusinessCategoryModel } from '@Model/Product/BusinessCategory';
import { CommonService } from '../Common.service';
import { business } from '@Root/Database/Table/Product/business';

@Injectable()
export class BusinessCategoryService {
    constructor(private _CommonService: CommonService) {
    }

    async GetAll() {
        const BusinessCategoryList = await business_category.find({order: { display_order: 'ASC' }});
        const BusinessCategoryListListWithUsage = [];
        for (const Data of BusinessCategoryList) {
          const IsUsed = await business.count({ where: { business_category_id: Data.id } }) > 0;
          BusinessCategoryListListWithUsage.push({
            ...Data,
            is_used: IsUsed,
          });
        }
        return BusinessCategoryListListWithUsage;
      }

    async GetById(BusinessCategoryId: string) {
        const BusinessCategoryGetById = await business_category.findOne({ where: { id: BusinessCategoryId }, order:{display_order:'ASC'} });
        if (!BusinessCategoryGetById) {
            throw new Error('Record not found')
        }
        return BusinessCategoryGetById;
    }

    async Insert(BusinessCategoryData: BusinessCategoryModel, UserId: string) {
        const _BusinessCategoryData = new business_category();
        _BusinessCategoryData.name = BusinessCategoryData.name.trimStart().trimEnd();
        const nextDisplayOrder = await this._CommonService.getLastDisplayOrder('business_category');
        _BusinessCategoryData.display_order = nextDisplayOrder;
        _BusinessCategoryData.created_by_id = UserId;
        _BusinessCategoryData.created_on = new Date();
        await business_category.insert(_BusinessCategoryData);
        return _BusinessCategoryData;
    }

    async Update(Id: string, BusinessCategoryData: BusinessCategoryModel, UserId: string) {
        const BusinessCategoryUpdateData = await business_category.findOne({ where: { id: Id } });
        if (!BusinessCategoryUpdateData) {
            throw new Error('Record not found')
        }
        const nextDisplayOrderUpdate = await this._CommonService.getLastDisplayOrderUpdate('business_category');
        if (BusinessCategoryData.display_order > nextDisplayOrderUpdate) {
        throw new Error(`Display order cannot be greater than the current max (${nextDisplayOrderUpdate})`);
        }
        BusinessCategoryUpdateData.name = BusinessCategoryData.name.trimStart().trimEnd();
        BusinessCategoryUpdateData.display_order = BusinessCategoryData.display_order;
        BusinessCategoryUpdateData.updated_by_id = UserId;
        BusinessCategoryUpdateData.updated_on = new Date();
        await business_category.update(Id, BusinessCategoryUpdateData);
        return BusinessCategoryUpdateData;
    }

    async Delete(Id: string) {
      const BusinessCategoryData = await business_category.findOne({ where: { id: Id } });
      if (!BusinessCategoryData) {
        throw new Error(ResponseEnum.NotFound);
      }
      await BusinessCategoryData.remove();
      return true;
    }
}
