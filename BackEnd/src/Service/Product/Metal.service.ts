import { Injectable } from '@nestjs/common';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { metal } from '@Root/Database/Table/Product/metal';
import { MetalModel } from '@Model/Product/Metal.model';
import { product } from '@Root/Database/Table/Product/product';
import { CommonService } from '../Common.service';

@Injectable()
export class MetalService {
    constructor(private _CommonService: CommonService) {
    }

    async GetAll() {
      const MetalList = await metal.find({order:{display_order:'ASC'}});
      const MetalListWithUsage = [];
      for (const Data of MetalList) {
        const IsUsed = await product.count({ where: { metal_id: Data.id } }) > 0;
        MetalListWithUsage.push({
          ...Data,
          is_used: IsUsed,
        });
      }
      return MetalListWithUsage;
    }

    async GetById(MetalId: string) {
            const MetalData = await metal.findOne({ where: { id: MetalId }, order:{display_order:'ASC'}});
            return MetalData;
        }


    async Insert(MetalData: MetalModel, UserId: string) {
        const _MetalData = new metal();
        _MetalData.name = MetalData.name.trimStart().trimEnd();
        _MetalData.code = MetalData.code;
        const nextDisplayOrder = await this._CommonService.getLastDisplayOrder('metal');
        _MetalData.display_order = nextDisplayOrder;
        _MetalData.created_by_id = UserId;
        _MetalData.created_on = new Date();
        await metal.insert(_MetalData);
        return _MetalData;
    }

    async Update(Id: string, MetalData: MetalModel, UserId: string) {
        const MetalUpdateData = await metal.findOne({ where: { id: Id } });
        if (!MetalUpdateData) {
            throw new Error('Record not found')
        }
        const nextDisplayOrderUpdate = await this._CommonService.getLastDisplayOrderUpdate('metal');
        if (MetalData.display_order > nextDisplayOrderUpdate) {
          throw new Error(`Display order cannot be greater than the current max (${nextDisplayOrderUpdate})`);
       }
        MetalUpdateData.name = MetalData.name.trimStart().trimEnd();
        MetalUpdateData.code = MetalData.code;
        MetalUpdateData.display_order = MetalData.display_order;
        MetalUpdateData.updated_by_id = UserId;
        MetalUpdateData.updated_on = new Date();
        await metal.update(Id, MetalUpdateData);
        return MetalUpdateData;
    }

    async Delete(Id: string) {
      const MetalData = await metal.findOne({ where: { id: Id } });
      if (!MetalData) {
        throw new Error(ResponseEnum.NotFound);
      }
      await MetalData.remove();
      return true;
    }

}
