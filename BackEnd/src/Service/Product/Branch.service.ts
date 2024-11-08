import { Injectable } from '@nestjs/common';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { branch } from '@Root/Database/Table/Product/branch';
import { BranchModel } from '@Model/Product/Branch.model';
import { CommonService } from '../Common.service';

@Injectable()
export class BranchService {
    constructor(private _CommonService: CommonService) {
    }

    async GetAll() {
        const BranchList = await branch.find({order:{display_order:'ASC'}});
        return BranchList;
    }

    async GetById(BranchId: string) {
        const BranchGetById = await branch.findOne({ where: { id: BranchId }, order:{display_order:'ASC'} });
        if (!BranchGetById) {
            throw new Error('Record not found')
        }
        return BranchGetById;
    }

    async Insert(BranchData: BranchModel, UserId: string) {
        const _BranchData = new branch();
        _BranchData.name = BranchData.name;
        _BranchData.mobile_no = BranchData.mobile_no;
        _BranchData.address = BranchData.address;
        const nextDisplayOrder = await this._CommonService.getLastDisplayOrder('branch');
        _BranchData.display_order = nextDisplayOrder;
        _BranchData.created_by_id = UserId;
        _BranchData.created_on = new Date();
        await branch.insert(_BranchData);
        return _BranchData;
    }

    async Update(Id: string, BranchData: BranchModel, UserId: string) {
        const BranchUpdateData = await branch.findOne({ where: { id: Id } });
        if (!BranchUpdateData) {
            throw new Error('Record not found')
        }
        const nextDisplayOrderUpdate = await this._CommonService.getLastDisplayOrderUpdate('branch');
        if (BranchData.display_order > nextDisplayOrderUpdate) {
        throw new Error(`Display order cannot be greater than the current max (${nextDisplayOrderUpdate})`);
    }
        BranchUpdateData.name = BranchData.name;
        BranchUpdateData.mobile_no = BranchData.mobile_no;
        BranchUpdateData.address = BranchData.address;
        BranchUpdateData.display_order = BranchData.display_order;
        BranchUpdateData.updated_by_id = UserId;
        BranchUpdateData.updated_on = new Date();
        await branch.update(Id, BranchUpdateData);
        return BranchUpdateData;
    }

    async Delete(Id: string) {
      const BranchData = await branch.findOne({ where: { id: Id } });
      if (!BranchData) {
        throw new Error(ResponseEnum.NotFound);
      }
      await BranchData.remove();
      return true;
    }
}
