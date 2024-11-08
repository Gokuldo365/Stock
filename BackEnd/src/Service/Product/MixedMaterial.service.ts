import { Injectable } from '@nestjs/common';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { mixed_material } from '@Root/Database/Table/Product/mixed_material';
import { MixedMaterialModel } from '@Model/Product/MixedMaterial.model';
import { CommonService } from '../Common.service';
import { product } from '@Root/Database/Table/Product/product';
import { product_mixed_material } from '@Root/Database/Table/Product/product_mixed_material';

@Injectable()
export class MixedMaterialService {
    constructor(private _CommonService: CommonService) {
    }

    async GetAll() {
        const MixedMaterialList = await mixed_material.find({order: { display_order: 'ASC' }});
        const MixedMaterialListWithUsage = [];
        for (const Data of MixedMaterialList) {
          const IsUsed = await product_mixed_material.count({ where: { mixed_material_id: Data.id } }) > 0;
          MixedMaterialListWithUsage.push({
            ...Data,
            is_used: IsUsed,
          });
        }
        return MixedMaterialListWithUsage;
      }

    async GetById(MixedMaterialId: string) {
        const MixedMaterialGetById = await mixed_material.findOne({ where: { id: MixedMaterialId }, order:{display_order:'ASC'} });
        if (!MixedMaterialGetById) {
            throw new Error('Record not found')
        }
        return MixedMaterialGetById;
    }

    async Insert(MixedMaterialData: MixedMaterialModel, UserId: string) {
        const _MixedMaterialData = new mixed_material();
        _MixedMaterialData.name = MixedMaterialData.name.trimStart().trimEnd();
        _MixedMaterialData.weight = MixedMaterialData.weight;
        _MixedMaterialData.karat = MixedMaterialData.karat;
        _MixedMaterialData.cent = MixedMaterialData.cent;
        const nextDisplayOrder = await this._CommonService.getLastDisplayOrder('mixed_material');
        _MixedMaterialData.display_order = nextDisplayOrder;
        _MixedMaterialData.created_by_id = UserId;
        _MixedMaterialData.created_on = new Date();
        await mixed_material.insert(_MixedMaterialData);
        return _MixedMaterialData;
    }

    async Update(Id: string, MixedMaterialData: MixedMaterialModel, UserId: string) {
        const MixedMaterialUpdateData = await mixed_material.findOne({ where: { id: Id } });
        if (!MixedMaterialUpdateData) {
            throw new Error('Record not found')
        }
        const nextDisplayOrderUpdate = await this._CommonService.getLastDisplayOrderUpdate('mixed_material');
        if (MixedMaterialData.display_order > nextDisplayOrderUpdate) {
        throw new Error(`Display order cannot be greater than the current max (${nextDisplayOrderUpdate})`);
        }
        MixedMaterialUpdateData.name = MixedMaterialData.name.trimStart().trimEnd();
        MixedMaterialUpdateData.weight = MixedMaterialData.weight;
        MixedMaterialUpdateData.karat = MixedMaterialData.karat;
        MixedMaterialUpdateData.cent = MixedMaterialData.cent;
        MixedMaterialUpdateData.display_order = MixedMaterialData.display_order;
        MixedMaterialUpdateData.updated_by_id = UserId;
        MixedMaterialUpdateData.updated_on = new Date();
        await mixed_material.update(Id, MixedMaterialUpdateData);
        return MixedMaterialUpdateData;
    }

    async Delete(Id: string) {
      const MixedMaterialData = await mixed_material.findOne({ where: { id: Id } });
      if (!MixedMaterialData) {
        throw new Error(ResponseEnum.NotFound);
      }
      await MixedMaterialData.remove();
      return true;
    }
}
