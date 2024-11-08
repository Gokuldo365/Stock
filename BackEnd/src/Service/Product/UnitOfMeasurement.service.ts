import { UnitOfMeasurementModel } from "@Model/Product/UnitOfMeasurement.model";
import { Injectable } from "@nestjs/common";
import { product } from "@Root/Database/Table/Product/product";
import { unit_of_measurement } from "@Root/Database/Table/Product/unit_of_measurement";
import { CommonService } from "../Common.service";

@Injectable()
export class UnitOfMeasurementService {

    constructor(private _CommonService: CommonService) { }

    async GetAll() {
      const MetalList = await unit_of_measurement.find({order: { display_order: 'ASC' }});
      const MetalListWithUsage = [];
      for (const Data of MetalList) {
        const IsUsed = await product.count({ where: { unit_of_measurement_id: Data.id } }) > 0;
        MetalListWithUsage.push({
          ...Data,
          is_used: IsUsed,
        });
      }
      return MetalListWithUsage;
    }


    async GetById(Id: string) {
        const UnitOfMeasurementDataId = await unit_of_measurement.findOne({ where: { id: Id }, order:{display_order:'ASC'} });
        if (!UnitOfMeasurementDataId) {
            throw new Error('Record Not Found');
        }
        return UnitOfMeasurementDataId;
    }

    async Insert(UnitOfMeasurementData: UnitOfMeasurementModel, UserId: string) {
        const _UnitOfMeasurementData = new unit_of_measurement();
        _UnitOfMeasurementData.name = UnitOfMeasurementData.name.trimStart().trimEnd();
        _UnitOfMeasurementData.code = UnitOfMeasurementData.code;
        _UnitOfMeasurementData.quantity = UnitOfMeasurementData.quantity;
        const nextDisplayOrder = await this._CommonService.getLastDisplayOrder('unit_of_measurement');
        _UnitOfMeasurementData.display_order = nextDisplayOrder;
        _UnitOfMeasurementData.created_by_id = UserId;
        _UnitOfMeasurementData.created_on = new Date();
        await unit_of_measurement.insert(_UnitOfMeasurementData);
        return _UnitOfMeasurementData;
    }

    async Update(Id: string, UnitOfMeasurementData: UnitOfMeasurementModel, UserId: string) {
        const UnitOfMeasurementUpdateData = await unit_of_measurement.findOne({ where: { id: Id } });
        if (!UnitOfMeasurementUpdateData) {
            throw new Error('Record not Found');
        }
        const nextDisplayOrderUpdate = await this._CommonService.getLastDisplayOrderUpdate('unit_of_measurement');
        if (UnitOfMeasurementData.display_order > nextDisplayOrderUpdate) {
        throw new Error(`Display order cannot be greater than the current max (${nextDisplayOrderUpdate})`);
        }
        UnitOfMeasurementUpdateData.name = UnitOfMeasurementData.name.trimStart().trimEnd();
        UnitOfMeasurementUpdateData.code = UnitOfMeasurementData.code;
        UnitOfMeasurementUpdateData.quantity = UnitOfMeasurementData.quantity;
        UnitOfMeasurementUpdateData.display_order = UnitOfMeasurementData.display_order;
        UnitOfMeasurementUpdateData.updated_by_id = UserId;
        UnitOfMeasurementUpdateData.updated_on = new Date();
        await unit_of_measurement.update(Id, UnitOfMeasurementUpdateData);
        return UnitOfMeasurementUpdateData;
    }

    async Delete(Id: string) {
        const UnitOfMeasurementData = await unit_of_measurement.findOne({ where: { id: Id } });
        if (!UnitOfMeasurementData) {
            throw new Error('Record not Found');
        }
        await UnitOfMeasurementData.remove();
    }
}
