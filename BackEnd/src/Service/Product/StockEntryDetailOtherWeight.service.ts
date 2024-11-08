import { Injectable } from '@nestjs/common';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { StockEntryTypeEnum } from '@Root/Helper/Enum/StockEntryTypeEnum';
import { stock_entry_detail_other_weight } from '@Root/Database/Table/Product/stock_entry_detail_other_weight';
import { StockEntryDetailOtherWeightModel } from '@Model/Product/StockEntryDetailOtherWeight.model';

@Injectable()
export class StockEntryDetailOtherWeightService {
    constructor() {
    }

    async GetAll() {
        const SedOtherWeightList = await stock_entry_detail_other_weight.find();
        return SedOtherWeightList;
    }

    async GetById(SedOtherWeightId: string) {
        const SedOtherWeightGetById = await stock_entry_detail_other_weight.findOne({ where: { id: SedOtherWeightId } });
        if (!SedOtherWeightGetById) {
            throw new Error('Record not found')
        }
        return SedOtherWeightGetById;
    }

    async Insert(SedOtherWeightData: StockEntryDetailOtherWeightModel, UserId: string) {
        if (SedOtherWeightData.stock_entry_type === StockEntryTypeEnum.Issue) {
            return this.SalesIssueEntry(SedOtherWeightData, UserId);
        } else if (SedOtherWeightData.stock_entry_type === StockEntryTypeEnum.Receipt) {
            return this.SalesReceiptEntry(SedOtherWeightData, UserId);
        }
    }
    async SalesIssueEntry(SedOtherWeightData: StockEntryDetailOtherWeightModel, UserId: string){
        const _SedOtherWeightData = new stock_entry_detail_other_weight();
        _SedOtherWeightData.stock_entry_detail_id = SedOtherWeightData.stock_entry_detail_id;
        _SedOtherWeightData.product_mixed_material_id = SedOtherWeightData.product_mixed_material_id;
        _SedOtherWeightData.weight = SedOtherWeightData.weight;
        _SedOtherWeightData.created_by_id = UserId;
        _SedOtherWeightData.created_on = new Date();
        await stock_entry_detail_other_weight.insert(_SedOtherWeightData);
        return _SedOtherWeightData;
    }
    async SalesReceiptEntry(SedOtherWeightData: StockEntryDetailOtherWeightModel, UserId: string) {
        const _SedOtherWeightData = new stock_entry_detail_other_weight();
        _SedOtherWeightData.stock_entry_detail_id = SedOtherWeightData.stock_entry_detail_id;
        _SedOtherWeightData.product_mixed_material_id = SedOtherWeightData.product_mixed_material_id;
        _SedOtherWeightData.weight = SedOtherWeightData.weight;
        _SedOtherWeightData.created_by_id = UserId;
        _SedOtherWeightData.created_on = new Date();
        await stock_entry_detail_other_weight.insert(_SedOtherWeightData);
        return _SedOtherWeightData;
      }

      async Update(Id: string, SedOtherWeightData: StockEntryDetailOtherWeightModel, UserId: string) {
        if (SedOtherWeightData.stock_entry_type === StockEntryTypeEnum.Issue) {
            return this.SalesIssueEntryUpdate(Id, SedOtherWeightData, UserId);
        } else if (SedOtherWeightData.stock_entry_type === StockEntryTypeEnum.Receipt) {
            return this.SalesReceiptEntryUpdate(Id, SedOtherWeightData, UserId);
        }
    }
    async SalesIssueEntryUpdate(Id: string, SedOtherWeightData: StockEntryDetailOtherWeightModel, UserId: string){
        const SedOtherWeightUpdateData = await stock_entry_detail_other_weight.findOne({ where: { id: Id } });
        if (!SedOtherWeightUpdateData) {
            throw new Error('Record not found')
        }
        SedOtherWeightUpdateData.stock_entry_detail_id = SedOtherWeightData.stock_entry_detail_id;
        SedOtherWeightUpdateData.product_mixed_material_id = SedOtherWeightData.product_mixed_material_id;
        SedOtherWeightUpdateData.weight = SedOtherWeightData.weight;
        SedOtherWeightUpdateData.updated_by_id = UserId;
        SedOtherWeightUpdateData.updated_on = new Date();
        await stock_entry_detail_other_weight.update(Id, SedOtherWeightUpdateData);
        return SedOtherWeightUpdateData;
    }
    async SalesReceiptEntryUpdate(Id: string, SedOtherWeightData: StockEntryDetailOtherWeightModel, UserId: string) {
        const SedOtherWeightUpdateData = await stock_entry_detail_other_weight.findOne({ where: { id: Id } });
        if (!SedOtherWeightUpdateData) {
            throw new Error('Record not found')
        }
        SedOtherWeightUpdateData.stock_entry_detail_id = SedOtherWeightData.stock_entry_detail_id;
        SedOtherWeightUpdateData.product_mixed_material_id = SedOtherWeightData.product_mixed_material_id;
        SedOtherWeightUpdateData.weight = SedOtherWeightData.weight;
        SedOtherWeightUpdateData.updated_by_id = UserId;
        SedOtherWeightUpdateData.updated_on = new Date();
        await stock_entry_detail_other_weight.update(Id, SedOtherWeightUpdateData);
        return SedOtherWeightUpdateData;
      }

    async Delete(Id: string) {
      const SedOtherWeightData = await stock_entry_detail_other_weight.findOne({ where: { id: Id } });
      if (!SedOtherWeightData) {
        throw new Error(ResponseEnum.NotFound);
      }
      await SedOtherWeightData.remove();
      return true;
    }
}
