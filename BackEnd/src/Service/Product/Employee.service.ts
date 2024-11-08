import { Injectable } from '@nestjs/common';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { employee } from '@Root/Database/Table/Product/employee';
import { EmployeeModel } from '@Model/Product/Employee.model';
import { CommonService } from '../Common.service';
import { stock_entry } from '@Root/Database/Table/Product/stock_entry';
import { EncryptionService } from '../Encryption.service';
import { user } from '@Root/Database/Table/Admin/user';

@Injectable()
export class EmployeeService {
    constructor(private _CommonService: CommonService,private _EncryptionService: EncryptionService,
    ) {
    }

    // async GetAll() {
    //     const EmployeeList = await employee.find({ order: { display_order: 'ASC' } });
    //     for (const Data of EmployeeList) {
    //         const IsUsed = await stock_entry.count({ where: [{ hand_over_id: Data.id } ]}) > 0;
    //         (Data as any).is_used = IsUsed;
    //     }
    //     return EmployeeList;
    // }

        async GetAll() {
             const EmployeeList = await employee.find({ order: { display_order: 'ASC' } });
             return EmployeeList;
        }


    async GetById(EmployeeId: string) {
        const EmployeeGetById = await employee.findOne({ where: { id: EmployeeId }, order:{display_order:'ASC'} });
        if (!EmployeeGetById) {
            throw new Error('Record not found')
        }
        return EmployeeGetById;
    }

    async Insert(EmployeeData: EmployeeModel, UserId: string) {
        const _EmployeeData = new employee();
        _EmployeeData.first_name = EmployeeData.first_name.trimStart().trimEnd();
        _EmployeeData.user_role_id = EmployeeData.first_name.trimStart().trimEnd();
        _EmployeeData.last_name = EmployeeData.last_name.trimStart().trimEnd();
        _EmployeeData.email = EmployeeData.email;
        _EmployeeData.mobile_number = EmployeeData.mobile_number;
        _EmployeeData.password = this._EncryptionService.Encrypt(EmployeeData.password);
        _EmployeeData.user_role_id = EmployeeData.user_role_id;
        const nextDisplayOrder = await this._CommonService.getLastDisplayOrder('employee');
        _EmployeeData.display_order = nextDisplayOrder;
        _EmployeeData.created_by_id = UserId;
        _EmployeeData.created_on = new Date();
        await employee.insert(_EmployeeData);
        // User Insert
        const _UserData = new user();
        _UserData.user_role_id = _EmployeeData.user_role_id;
        _UserData.first_name = _EmployeeData.first_name
        _UserData.last_name = _EmployeeData.last_name
        _UserData.mobile = _EmployeeData.mobile_number
        _UserData.email = _EmployeeData.email
        _UserData.password = _EmployeeData.password
        await user.insert(_EmployeeData);
        return _EmployeeData;
    }

    async Update(Id: string, EmployeeData: EmployeeModel, UserId: string) {
        const EmployeeUpdateData = await employee.findOne({ where: { id: Id } });
        if (!EmployeeUpdateData) {
            throw new Error('Record not found')
        }
        const nextDisplayOrderUpdate = await this._CommonService.getLastDisplayOrderUpdate('employee');
        if (EmployeeData.display_order > nextDisplayOrderUpdate) {
        throw new Error(`Display order cannot be greater than the current max (${nextDisplayOrderUpdate})`);
        }
        EmployeeUpdateData.first_name = EmployeeData.first_name.trimStart().trimEnd();
        EmployeeUpdateData.last_name = EmployeeData.last_name.trimStart().trimEnd();
        EmployeeUpdateData.email = EmployeeData.email;
        EmployeeUpdateData.mobile_number = EmployeeData.mobile_number;
        EmployeeUpdateData.display_order = EmployeeData.display_order;
        EmployeeUpdateData.password = this._EncryptionService.Encrypt(EmployeeData.password);
        EmployeeUpdateData.user_role_id = EmployeeData.user_role_id;
        EmployeeUpdateData.updated_by_id = UserId;
        EmployeeUpdateData.updated_on = new Date();
        await employee.update(Id, EmployeeUpdateData);
        return EmployeeUpdateData;
    }

    async Delete(Id: string) {
      const EmployeeData = await employee.findOne({ where: { id: Id } });
      if (!EmployeeData) {
        throw new Error(ResponseEnum.NotFound);
      }
      await EmployeeData.remove();
      return true;
    }
}
