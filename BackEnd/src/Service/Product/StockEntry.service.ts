import { Injectable } from '@nestjs/common';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { stock_entry } from '@Root/Database/Table/Product/stock_entry';
import { StockEntryModel, StockFilterListModel } from '@Model/Product/StockEntry.model';
import { StockEntryTypeEnum } from '@Root/Helper/Enum/StockEntryTypeEnum';
import { DataSource } from 'typeorm';
import { CommonService } from '../Common.service';

@Injectable()
export class StockEntryService {
    constructor(private _DataSource: DataSource,private _CommonService: CommonService) {
    }
        async GetAll() {
        const StockEntryList = await stock_entry.find({where:{status:true , stock_entry_type: StockEntryTypeEnum.Issue} , relations: ['HandOverEmployee' , 'ReceivedByIdEmployee'],order: { id: 'DESC' }});
        return StockEntryList;
    }

    async OutwardGetAll() {
      const StockEntryList = await stock_entry.find({where:{status:true , stock_entry_type: StockEntryTypeEnum.Receipt}});
      return StockEntryList;
  }

        async GetById(StockEntryId: string) {
        const StockEntryGetById = await stock_entry.findOne({ where: { id: StockEntryId } });
        if (!StockEntryGetById) {
            throw new Error('Record not found')
        }
        return StockEntryGetById;
    }

    //     async Insert(StockEntryData: StockEntryModel, UserId: string) {
    //     if (StockEntryData.stock_entry_type === StockEntryTypeEnum.Issue) {
    //         return this.SalesIssueEntry(StockEntryData, UserId);
    //     } else if (StockEntryData.stock_entry_type === StockEntryTypeEnum.Receipt) {
    //         return this.SalesReceiptEntry(StockEntryData, UserId);
    //     }
    //     else if (StockEntryData.stock_entry_type === StockEntryTypeEnum.Issue) {
    //       return this.PurchaseIssueEntry(StockEntryData, UserId);
    //   }
    //   else if (StockEntryData.stock_entry_type === StockEntryTypeEnum.Receipt) {
    //     return this.PurchaseReceiptEntry(StockEntryData, UserId);
    // }
    // }
    //     async SalesIssueEntry(StockEntryData: StockEntryModel, UserId: string){
    //     let StockNumber = await this._DataSource.query(`
    //         SELECT se.stock_number
    //         FROM \`stock_entry\` as se
    //         WHERE se.stock_entry_type = '${StockEntryTypeEnum.SalesIssue}'
    //         ORDER BY se.created_on DESC,
    //                  CAST(REGEXP_REPLACE(se.stock_number, '[^0-9]', '0') AS UNSIGNED) DESC;
    //     `);
    //     if (StockNumber[0]?.stock_number) {
    //         StockNumber[0].stock_number = this._CommonService.AutoGenerateNumber(StockNumber[0].stock_number);
    //     } else {
    //         StockNumber[0] = { stock_number: "SI-00001" };
    //     }
    //     const _StockEntryData = new stock_entry();
    //     _StockEntryData.stock_number = StockNumber[0].stock_number;
    //     _StockEntryData.stock_entry_date_time = StockEntryData.stock_entry_date_time;
    //     _StockEntryData.stock_entry_type = StockEntryData.stock_entry_type;
    //     _StockEntryData.hand_over_id = StockEntryData.hand_over_id;
    //     _StockEntryData.received_by_id = StockEntryData.received_by_id;
    //     _StockEntryData.metal_id = StockEntryData.metal_id;
    //     _StockEntryData.purity_id = StockEntryData.purity_id;
    //     _StockEntryData.business_from_id = StockEntryData.business_from_id;
    //     _StockEntryData.business_to_id = StockEntryData.business_to_id;
    //     _StockEntryData.note = StockEntryData.note;
    //     _StockEntryData.created_by_id = UserId;
    //     _StockEntryData.created_on = new Date();
    //     await stock_entry.insert(_StockEntryData);
    //     return _StockEntryData;
    // }
    //     async SalesReceiptEntry(StockEntryData: StockEntryModel, UserId: string) {
    //       let StockNumber = await this._DataSource.query(`
    //         SELECT se.stock_number
    //         FROM \`stock_entry\` as se
    //         WHERE se.stock_entry_type = '${StockEntryTypeEnum.SalesReceipt}'
    //         ORDER BY se.created_on DESC,
    //                  CAST(REGEXP_REPLACE(se.stock_number, '[^0-9]', '0') AS UNSIGNED) DESC;
    //     `);
    //       if (StockNumber[0]?.stock_number) {
    //           StockNumber[0].stock_number = this._CommonService.AutoGenerateNumber(StockNumber[0].stock_number);
    //       }
    //       else {
    //           StockNumber[0] = {};
    //           StockNumber[0]['stock_number'] = "SR-00001";
    //       }
    //       const _StockEntryData = new stock_entry();
    //       _StockEntryData.stock_number = StockNumber[0].stock_number;
    //       _StockEntryData.stock_entry_date_time = StockEntryData.stock_entry_date_time;
    //       _StockEntryData.stock_entry_type = StockEntryData.stock_entry_type;
    //       _StockEntryData.hand_over_id = StockEntryData.hand_over_id;
    //       _StockEntryData.received_by_id = StockEntryData.received_by_id;
    //       _StockEntryData.metal_id = StockEntryData.metal_id;
    //       _StockEntryData.purity_id = StockEntryData.purity_id;
    //       _StockEntryData.business_from_id = StockEntryData.business_from_id;
    //       _StockEntryData.business_to_id = StockEntryData.business_to_id;
    //       _StockEntryData.note = StockEntryData.note;
    //       _StockEntryData.created_by_id = UserId;
    //       _StockEntryData.created_on = new Date();
    //       await stock_entry.insert(_StockEntryData);
    //       return _StockEntryData;
    //     }

    //     async PurchaseIssueEntry(StockEntryData: StockEntryModel, UserId: string) {
    //       let StockNumber = await this._DataSource.query(`
    //         SELECT se.stock_number
    //         FROM \`stock_entry\` as se
    //         WHERE se.stock_entry_type = '${StockEntryTypeEnum.PurchaseIssue}'
    //         ORDER BY se.created_on DESC,
    //                  CAST(REGEXP_REPLACE(se.stock_number, '[^0-9]', '0') AS UNSIGNED) DESC;
    //     `);
    //       if (StockNumber[0]?.stock_number) {
    //           StockNumber[0].stock_number = this._CommonService.AutoGenerateNumber(StockNumber[0].stock_number);
    //       }
    //       else {
    //           StockNumber[0] = {};
    //           StockNumber[0]['stock_number'] = "PI-00001";
    //       }
    //       const _StockEntryData = new stock_entry();
    //       _StockEntryData.stock_number = StockNumber[0].stock_number;
    //       _StockEntryData.stock_entry_date_time = StockEntryData.stock_entry_date_time;
    //       _StockEntryData.stock_entry_type = StockEntryData.stock_entry_type;
    //       _StockEntryData.hand_over_id = StockEntryData.hand_over_id;
    //       _StockEntryData.received_by_id = StockEntryData.received_by_id;
    //       _StockEntryData.metal_id = StockEntryData.metal_id;
    //       _StockEntryData.purity_id = StockEntryData.purity_id;
    //       _StockEntryData.business_from_id = StockEntryData.business_from_id;
    //       _StockEntryData.business_to_id = StockEntryData.business_to_id;
    //       _StockEntryData.note = StockEntryData.note;
    //       _StockEntryData.created_by_id = UserId;
    //       _StockEntryData.created_on = new Date();
    //       await stock_entry.insert(_StockEntryData);
    //       return _StockEntryData;
    //     }

    //     async PurchaseReceiptEntry(StockEntryData: StockEntryModel, UserId: string) {
    //       let StockNumber = await this._DataSource.query(`
    //         SELECT se.stock_number
    //         FROM \`stock_entry\` as se
    //         WHERE se.stock_entry_type = '${StockEntryTypeEnum.PurchaseReceipt}'
    //         ORDER BY se.created_on DESC,
    //                  CAST(REGEXP_REPLACE(se.stock_number, '[^0-9]', '0') AS UNSIGNED) DESC;
    //     `);
    //       if (StockNumber[0]?.stock_number) {
    //           StockNumber[0].stock_number = this._CommonService.AutoGenerateNumber(StockNumber[0].stock_number);
    //       }
    //       else {
    //           StockNumber[0] = {};
    //           StockNumber[0]['stock_number'] = "PR-00001";
    //       }
    //       const _StockEntryData = new stock_entry();
    //       _StockEntryData.stock_number = StockNumber[0].stock_number;
    //       _StockEntryData.stock_entry_date_time = StockEntryData.stock_entry_date_time;
    //       _StockEntryData.stock_entry_type = StockEntryData.stock_entry_type;
    //       _StockEntryData.hand_over_id = StockEntryData.hand_over_id;
    //       _StockEntryData.received_by_id = StockEntryData.received_by_id;
    //       _StockEntryData.metal_id = StockEntryData.metal_id;
    //       _StockEntryData.purity_id = StockEntryData.purity_id;
    //       _StockEntryData.business_from_id = StockEntryData.business_from_id;
    //       _StockEntryData.business_to_id = StockEntryData.business_to_id;
    //       _StockEntryData.note = StockEntryData.note;
    //       _StockEntryData.created_by_id = UserId;
    //       _StockEntryData.created_on = new Date();
    //       await stock_entry.insert(_StockEntryData);
    //       return _StockEntryData;
    //     }

    //     async Update(Id: string, StockEntryData: StockEntryModel, UserId: string) {

    //         if (StockEntryData.stock_entry_type === StockEntryTypeEnum.SalesIssue) {
    //             return this.SalesIssueEntryUpdate(Id, StockEntryData, UserId);
    //         } else if (StockEntryData.stock_entry_type === StockEntryTypeEnum.SalesReceipt) {
    //             return this.SalesReceiptEntryUpdate(Id, StockEntryData, UserId);
    //         }
    //         else if (StockEntryData.stock_entry_type === StockEntryTypeEnum.PurchaseIssue) {
    //           return this.PurchaseIssueEntryUpdate(Id, StockEntryData, UserId);
    //       }
    //       else if (StockEntryData.stock_entry_type === StockEntryTypeEnum.PurchaseReceipt) {
    //         return this.PurchaseReceiptEntryUpdate(Id, StockEntryData, UserId);
    //     }
    //     }
    //     async SalesIssueEntryUpdate(Id: string, StockEntryData: StockEntryModel, UserId: string){
    //         const StockEntryUpdateData = await stock_entry.findOne({ where: { id: Id } });
    //         if (!StockEntryUpdateData) {
    //             throw new Error('Record not found')
    //         }
    //         StockEntryUpdateData.stock_entry_date_time = StockEntryData.stock_entry_date_time;
    //         StockEntryUpdateData.stock_entry_type = StockEntryData.stock_entry_type;
    //         StockEntryUpdateData.hand_over_id = StockEntryData.hand_over_id;
    //         StockEntryUpdateData.received_by_id = StockEntryData.received_by_id;
    //         StockEntryUpdateData.metal_id = StockEntryData.metal_id;
    //         StockEntryUpdateData.purity_id = StockEntryData.purity_id;
    //         StockEntryUpdateData.business_from_id = StockEntryData.business_from_id;
    //         StockEntryUpdateData.business_to_id = StockEntryData.business_to_id;
    //         StockEntryUpdateData.note = StockEntryData.note;
    //         StockEntryUpdateData.updated_by_id = UserId;
    //         StockEntryUpdateData.updated_on = new Date();
    //         await stock_entry.update(Id, StockEntryUpdateData);
    //         return StockEntryUpdateData;
    //     }
    //     async SalesReceiptEntryUpdate(Id: string, StockEntryData: StockEntryModel, UserId: string) {
    //         const StockEntryUpdateData = await stock_entry.findOne({ where: { id: Id } });
    //         if (!StockEntryUpdateData) {
    //             throw new Error('Record not found')
    //         }
    //         StockEntryUpdateData.stock_entry_date_time = StockEntryData.stock_entry_date_time;
    //         StockEntryUpdateData.stock_entry_type = StockEntryData.stock_entry_type;
    //         StockEntryUpdateData.hand_over_id = StockEntryData.hand_over_id;
    //         StockEntryUpdateData.received_by_id = StockEntryData.received_by_id;
    //         StockEntryUpdateData.metal_id = StockEntryData.metal_id;
    //         StockEntryUpdateData.purity_id = StockEntryData.purity_id;
    //         StockEntryUpdateData.business_from_id = StockEntryData.business_from_id;
    //         StockEntryUpdateData.business_to_id = StockEntryData.business_to_id;
    //         StockEntryUpdateData.note = StockEntryData.note;
    //         StockEntryUpdateData.updated_by_id = UserId;
    //         StockEntryUpdateData.updated_on = new Date();
    //         await stock_entry.update(Id, StockEntryUpdateData);
    //         return StockEntryUpdateData;
    //       }

    //       async PurchaseIssueEntryUpdate(Id: string, StockEntryData: StockEntryModel, UserId: string) {
    //         const StockEntryUpdateData = await stock_entry.findOne({ where: { id: Id } });
    //         if (!StockEntryUpdateData) {
    //             throw new Error('Record not found')
    //         }
    //         StockEntryUpdateData.stock_entry_date_time = StockEntryData.stock_entry_date_time;
    //         StockEntryUpdateData.stock_entry_type = StockEntryData.stock_entry_type;
    //         StockEntryUpdateData.hand_over_id = StockEntryData.hand_over_id;
    //         StockEntryUpdateData.received_by_id = StockEntryData.received_by_id;
    //         StockEntryUpdateData.metal_id = StockEntryData.metal_id;
    //         StockEntryUpdateData.purity_id = StockEntryData.purity_id;
    //         StockEntryUpdateData.business_from_id = StockEntryData.business_from_id;
    //         StockEntryUpdateData.business_to_id = StockEntryData.business_to_id;
    //         StockEntryUpdateData.note = StockEntryData.note;
    //         StockEntryUpdateData.updated_by_id = UserId;
    //         StockEntryUpdateData.updated_on = new Date();
    //         await stock_entry.update(Id, StockEntryUpdateData);
    //         return StockEntryUpdateData;
    //       }

    //       async PurchaseReceiptEntryUpdate(Id: string, StockEntryData: StockEntryModel, UserId: string) {
    //         const StockEntryUpdateData = await stock_entry.findOne({ where: { id: Id } });
    //         if (!StockEntryUpdateData) {
    //             throw new Error('Record not found')
    //         }
    //         StockEntryUpdateData.stock_entry_date_time = StockEntryData.stock_entry_date_time;
    //         StockEntryUpdateData.stock_entry_type = StockEntryData.stock_entry_type;
    //         StockEntryUpdateData.hand_over_id = StockEntryData.hand_over_id;
    //         StockEntryUpdateData.received_by_id = StockEntryData.received_by_id;
    //         StockEntryUpdateData.metal_id = StockEntryData.metal_id;
    //         StockEntryUpdateData.purity_id = StockEntryData.purity_id;
    //         StockEntryUpdateData.business_from_id = StockEntryData.business_from_id;
    //         StockEntryUpdateData.business_to_id = StockEntryData.business_to_id;
    //         StockEntryUpdateData.note = StockEntryData.note;
    //         StockEntryUpdateData.updated_by_id = UserId;
    //         StockEntryUpdateData.updated_on = new Date();
    //         await stock_entry.update(Id, StockEntryUpdateData);
    //         return StockEntryUpdateData;
    //       }



        async Delete(Id: string, UserId: string) {
            const StockEntryData = await stock_entry.findOne({ where: { id: Id } });
            if (!StockEntryData) {
                throw new Error(ResponseEnum.NotFound);
            }
            StockEntryData.updated_by_id = UserId;
            StockEntryData.updated_on = new Date();
            StockEntryData.status = !StockEntryData.status;
            await StockEntryData.save();
            return true;
    }

    async StockEntryList(stockFilterData: StockFilterListModel) {
      let query = `
        SELECT
          se.id,
          se.created_on,
          se.stock_entry_type as stock_entry_type,
          se.sales_type as sales_type,
          se.stock_entry_date_time as stock_entry_date_time,
          se.stock_number as stock_number,
          m.name as metal_name,
          p.name as purity_name,
          b.business_name as business_from,
          se.hand_over_name as hand_over_name,
          (SELECT SUM(sed.gross_weight) FROM stock_entry_detail sed WHERE sed.stock_entry_id = se.id) AS gross,
          (SELECT SUM(sed.net_weight) FROM stock_entry_detail sed WHERE sed.stock_entry_id = se.id) AS nett,
          (SELECT SUM(sed.fine_weight) FROM stock_entry_detail sed WHERE sed.stock_entry_id = se.id) AS fine_weight,
          (SELECT SUM(sed.other_weight) FROM stock_entry_detail sed WHERE sed.stock_entry_id = se.id) AS other
        FROM
          stock_entry se
        INNER JOIN
          metal m ON m.id = se.metal_id
        INNER JOIN
          purity p ON p.id = se.purity_id
        INNER JOIN
          business b ON b.id = se.business_id
        WHERE 1 = 1
      `;

      const params: any[] = [];

      if (stockFilterData.date_from && stockFilterData.date_to) {
        const dateFrom = new Date(stockFilterData.date_from).toISOString();
        const dateTo = new Date(stockFilterData.date_to).toISOString();
        query += ` AND se.stock_entry_date_time BETWEEN ? AND ?`;
        params.push(dateFrom, dateTo);
      }

      if (stockFilterData.metal_id) {
        query += ` AND m.id = ?`;
        params.push(stockFilterData.metal_id);
      }

      if (stockFilterData.purity_id) {
        query += ` AND p.id = ?`;
        params.push(stockFilterData.purity_id);
      }

      if (stockFilterData.stock_entry_type) {
        query += ` AND se.stock_entry_type = ?`;
        params.push(stockFilterData.stock_entry_type);
      }

      query += ` ORDER BY se.stock_entry_date_time DESC`;

      const List = await this._DataSource.query(query, params);
      return List;
    }



}
