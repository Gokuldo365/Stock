import { Injectable } from '@nestjs/common';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { PurityModel } from '@Model/Product/Purity.model';
import { purity } from '@Root/Database/Table/Product/purity';
import { product } from '@Root/Database/Table/Product/product';
import { CommonService } from '../Common.service';

@Injectable()
export class PurityService {
    constructor(private _CommonService: CommonService) {
    }

    async GetAll() {
      const PurityList = await purity.find({relations:['metal'], order:{display_order:'ASC'}});
      const PurityListWithUsage = [];
      for (const Data of PurityList) {
        const IsUsed = await product.count({ where: { purity_id: Data.id } }) > 0;
        PurityListWithUsage.push({
          ...Data,
          is_used: IsUsed,
        });
      }
      return PurityListWithUsage;
    }

    async GetById(PurityId: string) {
            const PurityData = await purity.findOne({ where: { id: PurityId },relations:['metal'], order:{display_order:'ASC'} });
            return PurityData;
        }

    async Insert(PurityData: PurityModel, UserId: string) {
        const _PurityData = new purity();
        _PurityData.name = PurityData.name;
        _PurityData.code = PurityData.code;
        _PurityData.metal_id = PurityData.metal_id;
        _PurityData.melting = PurityData.melting;
        _PurityData.display_order = PurityData.display_order;
        const nextDisplayOrder = await this._CommonService.getLastDisplayOrder('purity');
        _PurityData.display_order = nextDisplayOrder;
        _PurityData.created_by_id = UserId;
        _PurityData.created_on = new Date();
        await purity.insert(_PurityData);
        return _PurityData;
    }

    async Update(Id: string, PurityData: PurityModel, UserId: string) {
        const PurityUpdateData = await purity.findOne({ where: { id: Id } });
        if (!PurityUpdateData) {
            throw new Error('Record not found')
        }
        const nextDisplayOrderUpdate = await this._CommonService.getLastDisplayOrderUpdate('purity');
        if (PurityData.display_order > nextDisplayOrderUpdate) {
        throw new Error(`Display order cannot be greater than the current max (${nextDisplayOrderUpdate})`);
        }
        PurityUpdateData.name = PurityData.name;
        PurityUpdateData.code = PurityData.code;
        PurityUpdateData.metal_id = PurityData.metal_id;
        PurityUpdateData.melting = PurityData.melting;
        PurityUpdateData.display_order = PurityData.display_order;
        PurityUpdateData.updated_by_id = UserId;
        PurityUpdateData.updated_on = new Date();
        await purity.update(Id, PurityUpdateData);
        return PurityUpdateData;
    }

    async Delete(Id: string) {
      const PurityData = await purity.findOne({ where: { id: Id } });
      if (!PurityData) {
        throw new Error(ResponseEnum.NotFound);
      }
      await PurityData.remove();
      return true;
    }

}
