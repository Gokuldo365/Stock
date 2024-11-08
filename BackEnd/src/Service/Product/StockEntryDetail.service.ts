import { Injectable } from '@nestjs/common';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { stock_entry_detail } from '@Root/Database/Table/Product/stock_entry_detail';
import { DataSource } from 'typeorm';
import { stock_entry_history } from '@Root/Database/Table/Product/stock_entry_history';
import { stock_entry_detail_other_weight } from '@Root/Database/Table/Product/stock_entry_detail_other_weight';
import { StockEntryTypeEnum } from '@Root/Helper/Enum/StockEntryTypeEnum';
import { RateCutCalculationModel, StockEntryAndDetailModel, StockEntryDetailModel } from '@Model/Product/StockEntryDetail.model';
import { CommonService } from '../Common.service';
import { stock_entry } from '@Root/Database/Table/Product/stock_entry';

@Injectable()
export class StockEntryDetailService {
  constructor(private _DataSource: DataSource, private _CommonService: CommonService) {
  }


  async Insert(StockEntryAndDetailData: StockEntryAndDetailModel, UserId: string) {
    if (StockEntryAndDetailData.stock_entry_type === StockEntryTypeEnum.Receipt) {
      return this.ReceiptEntry(StockEntryAndDetailData, UserId);
    }
    else if (StockEntryAndDetailData.stock_entry_type === StockEntryTypeEnum.Issue) {
      return this.IssueEntry(StockEntryAndDetailData, UserId);
    }
  }


  async ReceiptEntry(StockEntryAndDetailData: StockEntryAndDetailModel, UserId: string) {
    let StockNumber = await this._DataSource.query(`
      SELECT se.stock_number
      FROM \`stock_entry\` as se
      WHERE se.stock_entry_type = '${StockEntryTypeEnum.Receipt}'
      ORDER BY se.stock_entry_date_time DESC,
               CAST(REGEXP_REPLACE(se.stock_number, '[^0-9]', '0') AS UNSIGNED) DESC;
  `);
    if (StockNumber[0]?.stock_number) {
      StockNumber[0].stock_number = this._CommonService.AutoGenerateNumber(StockNumber[0].stock_number);
    }
    else {
      StockNumber[0] = {};
      StockNumber[0]['stock_number'] = "PR-00001";
    }
    const _StockEntryData = new stock_entry();
    _StockEntryData.stock_number = StockNumber[0].stock_number;
    _StockEntryData.stock_entry_date_time = StockEntryAndDetailData.stock_entry_date_time;
    _StockEntryData.stock_entry_type = StockEntryAndDetailData.stock_entry_type;
    _StockEntryData.hand_over_name = StockEntryAndDetailData.hand_over_name;
    _StockEntryData.metal_id = StockEntryAndDetailData.metal_id;
    _StockEntryData.purity_id = StockEntryAndDetailData.purity_id;
    _StockEntryData.business_id = StockEntryAndDetailData.business_id;
    _StockEntryData.note = StockEntryAndDetailData.note;
    _StockEntryData.created_by_id = UserId;
    _StockEntryData.created_on = new Date();
    await stock_entry.insert(_StockEntryData);

    //Receipt Detail Insert

    const mixed = StockEntryAndDetailData.mixed_material;
    const _StockEntryDetailData = new stock_entry_detail();
    _StockEntryDetailData.stock_entry_id = _StockEntryData.id;
    _StockEntryDetailData.product_id = StockEntryAndDetailData.product_id;
    _StockEntryDetailData.product_variants_id = StockEntryAndDetailData.product_variants_id;
    _StockEntryDetailData.combination = StockEntryAndDetailData.combination;
    _StockEntryDetailData.stock_qty = StockEntryAndDetailData.stock_qty;
    _StockEntryDetailData.gross_weight = StockEntryAndDetailData.gross_weight;
    _StockEntryDetailData.other_weight = StockEntryAndDetailData.other_weight;
    _StockEntryDetailData.net_weight = StockEntryAndDetailData.net_weight;
    _StockEntryDetailData.other_charges = StockEntryAndDetailData.other_charges;
    _StockEntryDetailData.melting = StockEntryAndDetailData.melting;
    _StockEntryDetailData.pure_weight = StockEntryAndDetailData.pure_weight;
    _StockEntryDetailData.wastage = StockEntryAndDetailData.wastage;
    _StockEntryDetailData.fine_weight = StockEntryAndDetailData.fine_weight;
    _StockEntryDetailData.mc_amount = StockEntryAndDetailData.mc_amount;
    _StockEntryDetailData.lab_rate = StockEntryAndDetailData.lab_rate;
    _StockEntryDetailData.amount = StockEntryAndDetailData.amount;
    _StockEntryDetailData.created_by_id = UserId;
    _StockEntryDetailData.created_on = new Date();
    await stock_entry_detail.insert(_StockEntryDetailData);
    mixed.forEach(async (element) => {
      const _StockEntryDetailotherData = new stock_entry_detail_other_weight();
      _StockEntryDetailotherData.stock_entry_detail_id = _StockEntryDetailData.id;
      _StockEntryDetailotherData.product_mixed_material_id = element.mixed_material_id;
      _StockEntryDetailotherData.weight = element.weight;
      _StockEntryDetailotherData.amount = element.amount;
      _StockEntryDetailotherData.created_by_id = UserId;
      _StockEntryDetailotherData.created_on = new Date();
      await stock_entry_detail_other_weight.insert(_StockEntryDetailotherData);
    });
    return _StockEntryData;
  }



  async IssueEntry(StockEntryAndDetailData: StockEntryAndDetailModel, UserId: string) {

    let StockNumber = await this._DataSource.query(`
      SELECT se.stock_number
      FROM \`stock_entry\` as se
      WHERE se.stock_entry_type = '${StockEntryTypeEnum.Issue}'
      ORDER BY se.stock_entry_date_time DESC,
               CAST(REGEXP_REPLACE(se.stock_number, '[^0-9]', '0') AS UNSIGNED) DESC;
  `);
    if (StockNumber[0]?.stock_number) {
      StockNumber[0].stock_number = this._CommonService.AutoGenerateNumber(StockNumber[0].stock_number);
    }
    else {
      StockNumber[0] = {};
      StockNumber[0]['stock_number'] = "SL-00001";
    }
    const _StockEntryData = new stock_entry();
    _StockEntryData.stock_number = StockNumber[0].stock_number;
    _StockEntryData.stock_entry_date_time = StockEntryAndDetailData.stock_entry_date_time;
    _StockEntryData.stock_entry_type = StockEntryAndDetailData.stock_entry_type;
    _StockEntryData.hand_over_name = StockEntryAndDetailData.hand_over_name;
    _StockEntryData.metal_id = StockEntryAndDetailData.metal_id;
    _StockEntryData.purity_id = StockEntryAndDetailData.purity_id;
    _StockEntryData.business_id = StockEntryAndDetailData.business_id;
    _StockEntryData.note = StockEntryAndDetailData.note;
    _StockEntryData.created_by_id = UserId;
    _StockEntryData.created_on = new Date();
    await stock_entry.insert(_StockEntryData);

    //Receipt Detail Insert

    const mixed = StockEntryAndDetailData.mixed_material;
    const _StockEntryDetailData = new stock_entry_detail();
    _StockEntryDetailData.stock_entry_id = _StockEntryData.id;
    _StockEntryDetailData.product_id = StockEntryAndDetailData.product_id;
    _StockEntryDetailData.product_variants_id = StockEntryAndDetailData.product_variants_id;
    _StockEntryDetailData.combination = StockEntryAndDetailData.combination;
    _StockEntryDetailData.stock_qty = StockEntryAndDetailData.stock_qty;
    _StockEntryDetailData.gross_weight = StockEntryAndDetailData.gross_weight;
    _StockEntryDetailData.other_weight = StockEntryAndDetailData.other_weight;
    _StockEntryDetailData.net_weight = StockEntryAndDetailData.net_weight;
    _StockEntryDetailData.other_charges = StockEntryAndDetailData.other_charges;
    _StockEntryDetailData.melting = StockEntryAndDetailData.melting;
    _StockEntryDetailData.pure_weight = StockEntryAndDetailData.pure_weight;
    _StockEntryDetailData.wastage = StockEntryAndDetailData.wastage;
    _StockEntryDetailData.fine_weight = StockEntryAndDetailData.fine_weight;
    _StockEntryDetailData.mc_amount = StockEntryAndDetailData.mc_amount;
    _StockEntryDetailData.lab_rate = StockEntryAndDetailData.lab_rate;
    _StockEntryDetailData.amount = StockEntryAndDetailData.amount;
    _StockEntryDetailData.created_by_id = UserId;
    _StockEntryDetailData.created_on = new Date();
    await stock_entry_detail.insert(_StockEntryDetailData);
    mixed.forEach(async (element) => {
      const _StockEntryDetailotherData = new stock_entry_detail_other_weight();
    _StockEntryDetailotherData.stock_entry_detail_id = _StockEntryDetailData.id;
    _StockEntryDetailotherData.product_mixed_material_id = element.mixed_material_id;
    _StockEntryDetailotherData.weight = element.weight;
    _StockEntryDetailotherData.amount = element.amount;
    _StockEntryDetailotherData.created_by_id = UserId;
    _StockEntryDetailotherData.created_on = new Date();
    await stock_entry_detail_other_weight.insert(_StockEntryDetailotherData);
    });
      return _StockEntryData;
  }

  async StockEntryDeailInsert(StockEntryDetailData : StockEntryDetailModel, UserId: string) {
      const mixed = StockEntryDetailData.mixed_material;
      const _StockEntryDetailData = new stock_entry_detail();
      _StockEntryDetailData.stock_entry_id = StockEntryDetailData.stock_entry_id;
      _StockEntryDetailData.product_id = StockEntryDetailData.product_id;
      _StockEntryDetailData.product_variants_id = StockEntryDetailData.product_variants_id;
      _StockEntryDetailData.combination = StockEntryDetailData.combination;
      _StockEntryDetailData.stock_qty = StockEntryDetailData.stock_qty;
      _StockEntryDetailData.gross_weight = StockEntryDetailData.gross_weight;
      _StockEntryDetailData.other_weight = StockEntryDetailData.other_weight;
      _StockEntryDetailData.net_weight = StockEntryDetailData.net_weight;
      _StockEntryDetailData.other_charges = StockEntryDetailData.other_charges;
      _StockEntryDetailData.melting = StockEntryDetailData.melting;
      _StockEntryDetailData.pure_weight = StockEntryDetailData.pure_weight;
      _StockEntryDetailData.wastage = StockEntryDetailData.wastage;
      _StockEntryDetailData.fine_weight = StockEntryDetailData.fine_weight;
      _StockEntryDetailData.mc_amount = StockEntryDetailData.mc_amount;
      _StockEntryDetailData.lab_rate = StockEntryDetailData.lab_rate;
      _StockEntryDetailData.amount = StockEntryDetailData.amount;
      _StockEntryDetailData.created_by_id = UserId;
      _StockEntryDetailData.created_on = new Date();
      await stock_entry_detail.insert(_StockEntryDetailData);
      mixed.forEach(async (element) => {
        const _StockEntryDetailotherData = new stock_entry_detail_other_weight();
      _StockEntryDetailotherData.stock_entry_detail_id = _StockEntryDetailData.id;
      _StockEntryDetailotherData.product_mixed_material_id = element.mixed_material_id;
      _StockEntryDetailotherData.weight = element.weight;
      _StockEntryDetailotherData.amount = element.amount;
      _StockEntryDetailotherData.created_by_id = UserId;
      _StockEntryDetailotherData.created_on = new Date();
      await stock_entry_detail_other_weight.insert(_StockEntryDetailotherData);
      });

      return _StockEntryDetailData;
  }



  async Update(Id: string, StockEntryDetailData : StockEntryDetailModel, UserId: string) {
    const StockEntryData = await stock_entry.findOne({where:{id:StockEntryDetailData.stock_entry_id}})
    const StockEntryDetailUpdateData = await stock_entry_detail.findOne({ where: { id: Id } });
    if (!StockEntryDetailUpdateData) {
      throw new Error('Record not found')
    }
    const mixed = StockEntryDetailData.mixed_material;
    delete StockEntryDetailData.mixed_material;
    StockEntryDetailUpdateData.stock_entry_id = StockEntryDetailData.stock_entry_id;
    StockEntryDetailUpdateData.product_id = StockEntryDetailData.product_id;
    StockEntryDetailUpdateData.product_variants_id = StockEntryDetailData.product_variants_id;
    StockEntryDetailUpdateData.combination = StockEntryDetailData.combination;
    StockEntryDetailUpdateData.stock_qty = StockEntryDetailData.stock_qty;
    StockEntryDetailUpdateData.gross_weight = StockEntryDetailData.gross_weight;
    StockEntryDetailUpdateData.other_weight = StockEntryDetailData.other_weight;
    StockEntryDetailUpdateData.net_weight = StockEntryDetailData.net_weight;
    StockEntryDetailUpdateData.other_charges = StockEntryDetailData.other_charges;
    StockEntryDetailUpdateData.melting = StockEntryDetailData.melting;
    StockEntryDetailUpdateData.pure_weight = StockEntryDetailData.pure_weight;
    StockEntryDetailUpdateData.wastage = StockEntryDetailData.wastage;
    StockEntryDetailUpdateData.fine_weight = StockEntryDetailData.fine_weight;
    StockEntryDetailUpdateData.mc_amount = StockEntryDetailData.mc_amount;
    StockEntryDetailUpdateData.lab_rate = StockEntryDetailData.lab_rate;
    StockEntryDetailUpdateData.amount = StockEntryDetailData.amount;
    StockEntryDetailUpdateData.updated_by_id = UserId;
    StockEntryDetailUpdateData.updated_on = new Date();
    await stock_entry_detail.update(Id, StockEntryDetailUpdateData);
    const _stock_entry_history = new stock_entry_history();
    _stock_entry_history.stock_entry_detail_id = Id;
    _stock_entry_history.modified_date = new Date();
    _stock_entry_history.modified_by = UserId;
    _stock_entry_history.notes = StockEntryDetailData.history_note;
    _stock_entry_history.created_by_id = UserId;
    _stock_entry_history.created_on = new Date();
    await stock_entry_history.insert(_stock_entry_history);
    const sed_other_weightdata = await stock_entry_detail_other_weight.find({ where: { stock_entry_detail_id: StockEntryDetailUpdateData.id } });
    sed_other_weightdata.forEach(async (element) => {
      await element.remove();
    });
    mixed.forEach(async (element) => {
      const _StockEntryDetailotherData = new stock_entry_detail_other_weight();
      _StockEntryDetailotherData.stock_entry_detail_id = StockEntryDetailUpdateData.id;
      _StockEntryDetailotherData.product_mixed_material_id = element.mixed_material_id;
      _StockEntryDetailotherData.weight = element.weight;
      _StockEntryDetailotherData.amount = element.amount;
      _StockEntryDetailotherData.created_by_id = UserId;
      _StockEntryDetailotherData.created_on = new Date();
      await stock_entry_detail_other_weight.insert(_StockEntryDetailotherData);
    });
    return StockEntryDetailUpdateData;
  }


  async GetAll(StockEntryId: string) {
    const StockEntryDetailList = await stock_entry_detail.find({ where: { stock_entry_id: StockEntryId }, relations: ['product', 'product_variants'] });
    return StockEntryDetailList;
  }

  async GetById(StockEntryDetailId: string) {
    const StockEntryDetailGetById = await stock_entry_detail.findOne({ where: { id: StockEntryDetailId } });
    if (!StockEntryDetailGetById) {
      throw new Error('Record not found')
    }
    return StockEntryDetailGetById;
  }

  //   async Insert(StockEntryDetailData, UserId: string) {
  //     const mixed = StockEntryDetailData.mixed_material;
  //     const _StockEntryDetailData = new stock_entry_detail();
  //     _StockEntryDetailData.stock_entry_id = StockEntryDetailData.stock_entry_id;
  //     _StockEntryDetailData.product_id = StockEntryDetailData.product_id;
  //     _StockEntryDetailData.product_variants_id = StockEntryDetailData.product_variants_id;
  //     _StockEntryDetailData.combination = StockEntryDetailData.combination;
  //     _StockEntryDetailData.stock_qty = StockEntryDetailData.stock_qty;
  //     _StockEntryDetailData.gross_weight = StockEntryDetailData.gross_weight;
  //     _StockEntryDetailData.other_weight = StockEntryDetailData.other_weight;
  //     _StockEntryDetailData.net_weight = StockEntryDetailData.net_weight;
  //     _StockEntryDetailData.other_charges = StockEntryDetailData.other_charges;
  //     _StockEntryDetailData.melting = StockEntryDetailData.melting;
  //     _StockEntryDetailData.wastage = StockEntryDetailData.wastage;
  //     _StockEntryDetailData.fine_weight = StockEntryDetailData.fine_weight;
  //     _StockEntryDetailData.mc_amount = StockEntryDetailData.mc_amount;
  //     _StockEntryDetailData.created_by_id = UserId;
  //     _StockEntryDetailData.created_on = new Date();
  //     await stock_entry_detail.insert(_StockEntryDetailData);
  //     mixed.forEach(async (element) => {
  //       const _StockEntryDetailotherData = new stock_entry_detail_other_weight();
  //     _StockEntryDetailotherData.stock_entry_detail_id = _StockEntryDetailData.id;
  //     _StockEntryDetailotherData.product_mixed_material_id = element.mixed_material_id;
  //     _StockEntryDetailotherData.weight = element.weight;
  //     _StockEntryDetailotherData.amount = element.amount;
  //     _StockEntryDetailotherData.created_by_id = UserId;
  //     _StockEntryDetailotherData.created_on = new Date();
  //     await stock_entry_detail_other_weight.insert(_StockEntryDetailotherData);
  //     });
  //     return _StockEntryDetailData;
  //     // if (StockEntryDetailData.stock_entry_type === StockEntryTypeEnum.SalesIssue) {
  //     //     return this.InwardEntry(StockEntryDetailData, UserId);
  //     // } else if (StockEntryDetailData.stock_entry_type === StockEntryTypeEnum.SalesReceipt) {
  //     //     return this.OutwardEntry(StockEntryDetailData, UserId);
  //     // }
  // }


  // async Update(Id: string, StockEntryDetailData, UserId: string) {
  //   const StockEntryDetailUpdateData = await stock_entry_detail.findOne({ where: { id: Id } });
  //   if (!StockEntryDetailUpdateData) {
  //     throw new Error('Record not found')
  //   }
  //   const mixed = StockEntryDetailData.mixed_material;
  //   delete StockEntryDetailData.mixed_material;
  //   StockEntryDetailUpdateData.stock_entry_id = StockEntryDetailData.stock_entry_id;
  //   StockEntryDetailUpdateData.product_id = StockEntryDetailData.product_id;
  //   StockEntryDetailUpdateData.product_variants_id = StockEntryDetailData.product_variants_id;
  //   StockEntryDetailUpdateData.combination = StockEntryDetailData.combination;
  //   StockEntryDetailUpdateData.stock_qty = StockEntryDetailData.stock_qty;
  //   StockEntryDetailUpdateData.gross_weight = StockEntryDetailData.gross_weight;
  //   StockEntryDetailUpdateData.other_weight = StockEntryDetailData.other_weight;
  //   StockEntryDetailUpdateData.net_weight = StockEntryDetailData.net_weight;
  //   StockEntryDetailUpdateData.other_charges = StockEntryDetailData.other_charges;
  //   StockEntryDetailUpdateData.melting = StockEntryDetailData.melting;
  //   StockEntryDetailUpdateData.wastage = StockEntryDetailData.wastage;
  //   StockEntryDetailUpdateData.fine_weight = StockEntryDetailData.fine_weight;
  //   StockEntryDetailUpdateData.mc_amount = StockEntryDetailData.mc_amount;
  //   StockEntryDetailUpdateData.updated_by_id = UserId;
  //   StockEntryDetailUpdateData.updated_on = new Date();
  //   await stock_entry_detail.update(Id, StockEntryDetailUpdateData);
  //   const _stock_entry_history = new stock_entry_history();
  //   _stock_entry_history.stock_entry_detail_id = Id;
  //   _stock_entry_history.modified_date = new Date();
  //   _stock_entry_history.modified_by = UserId;
  //   _stock_entry_history.notes = StockEntryDetailData.notes;
  //   _stock_entry_history.created_by_id = UserId;
  //   _stock_entry_history.created_on = new Date();
  //   await stock_entry_history.insert(_stock_entry_history);
  //   const sed_other_weightdata = await stock_entry_detail_other_weight.find({ where: { stock_entry_detail_id: StockEntryDetailUpdateData.id } });
  //   sed_other_weightdata.forEach(async (element) => {
  //     await element.remove();
  //   });
  //   mixed.forEach(async (element) => {
  //     const _StockEntryDetailotherData = new stock_entry_detail_other_weight();
  //     _StockEntryDetailotherData.stock_entry_detail_id = StockEntryDetailUpdateData.id;
  //     _StockEntryDetailotherData.product_mixed_material_id = element.mixed_material_id;
  //     _StockEntryDetailotherData.weight = element.weight;
  //     _StockEntryDetailotherData.amount = element.amount;
  //     _StockEntryDetailotherData.created_by_id = UserId;
  //     _StockEntryDetailotherData.created_on = new Date();
  //     await stock_entry_detail_other_weight.insert(_StockEntryDetailotherData);
  //   });
  //   return StockEntryDetailUpdateData;
  //   // if (StockEntryDetailData.stock_entry_type === StockEntryTypeEnum.SalesIssue) {
  //   //     return this.InwardEntryUpdate(Id, StockEntryDetailData, UserId);
  //   // } else if (StockEntryDetailData.stock_entry_type === StockEntryTypeEnum.SalesReceipt) {
  //   //     return this.OutwardEntryUpdate(Id, StockEntryDetailData, UserId);
  //   // }
  // }


  async Delete(Id: string) {
    const StockEntryDetailData = await stock_entry_detail.findOne({ where: { id: Id } });
    if (!StockEntryDetailData) {
      throw new Error(ResponseEnum.NotFound);
    }
    const sed_other_weightdata = await stock_entry_detail_other_weight.find({ where: { stock_entry_detail_id: Id } });
    sed_other_weightdata.forEach(async (element) => {
      await element.remove();
    });
    await StockEntryDetailData.remove();
    return true;
  }




  async StockProductList(StockEntryProductData) {
    const ProductList = await this._DataSource.query(`
      SELECT
        p.id,
        p.name,
        p.product_code,
        p.category_id,
        p.metal_id,
        p.purity_id,
        p.product_type,
        p.display_order,
        p.unit_of_measurement_id,
        p.melting,
        c.name as category_name,
        c.parent_category_id,
        uom.name as unit_name
      FROM
        product p
      inner join
        category c
      on
        c.id = p.category_id
      inner JOIN
        unit_of_measurement uom
      on
        uom.id = p.unit_of_measurement_id
      WHERE
        p.metal_id = '${StockEntryProductData.metal_id}'
        and
        p.purity_id = '${StockEntryProductData.purity_id}'
        `)
    return ProductList;
  };

  async StockVarientList(Product_id: string) {
    const List = await this._DataSource.query(`
      select
        pv.id,
        pv.product_id,
        pv.combination
      FROM
        product_variants pv
      WHERE
        pv.product_id = '${Product_id}'
        `)
    return List;
  }


  async StockMixedMaterialList(Product_id: string) {
    const List = await this._DataSource.query(`
      SELECT
        pmm.id,
        pmm.mixed_material_id,
        pmm.product_id,
        pmm.display_order,
        mm.name as material_name
      FROM
        product_mixed_material pmm
      inner join
        mixed_material mm
      on
        mm.id = pmm.mixed_material_id
      WHERE
        pmm.product_id = '${Product_id}'
      ORDER BY mm.display_order ASC
        `)
    return List;
  }


  async StockEntryDetailList(StockEntryId: string) {
    const List = await this._DataSource.query(`
     SELECT
      se.id,
      se.product_id,
      se.stock_entry_id,
      se.combination,
      se.stock_qty,
      se.gross_weight,
      se.other_weight,
      se.net_weight,
       se.other_charges,
		se.melting,
		se.wastage,
		se.fine_weight,
		se.mc_amount,
      se.product_variants_id,
      p.name AS product_name,
      p.product_code,
      p.product_type,
      m.name AS metal_name,
      pu.name AS purity_name,
      c.name as category_name,
     	uom.name as unit_name,
      (SELECT
              CONCAT(
                  '[',
                  GROUP_CONCAT(
                      JSON_OBJECT(
                          'id' ,sow.id,
                          'stock_entry_detail_id', sow.stock_entry_detail_id,
                          'product_mixed_material_id', sow.product_mixed_material_id,
                          'weight', sow.weight,
                          'amount', sow.amount,
                          'name', m.name
                          ) ORDER BY m.display_order ASC
                      ),
                  ']'
              )

              FROM
                  stock_entry_detail_other_weight sow
                 inner join
                 product_mixed_material pmm
                on
                	pmm.id = sow.product_mixed_material_id
            INNER JOIN
              mixed_material AS m
            on
              m.id = pmm.mixed_material_id
              WHERE
                  sow.stock_entry_detail_id = se.id
                  ) as mixed_material,
        (SELECT
    CONCAT(
        '[',
        GROUP_CONCAT(
            JSON_OBJECT(
                'id' ,seh.id,
                'stock_entry_detail_id', seh.stock_entry_detail_id,
                'modified_by', seh.modified_by,
                'modified_date', seh.modified_date,
                'notes' , seh.notes,
                'name' , u.email
                )
            ),
        ']'
    )

    FROM
        stock_entry_history seh
    inner join
     	user u
     on
     	u.id = seh.modified_by
    WHERE
        seh.stock_entry_detail_id = se.id
        order by seh.id DESC
        ) as history

    FROM
      stock_entry_detail AS se
    INNER JOIN
      stock_entry AS s
    ON
      s.id = se.stock_entry_id
    INNER JOIN
      metal AS m
    ON
      m.id = s.metal_id
    INNER JOIN
      purity AS pu
    ON
      pu.id = s.purity_id
    INNER JOIN
      product AS p
    ON
      p.id = se.product_id

    INNER JOIN
      category AS c
    ON
      c.id = p.category_id
    LEFT outer JOIN
    	unit_of_measurement uom
    on
    	uom.id = p.unit_of_measurement_id
    WHERE
      se.stock_entry_id = '${StockEntryId}'
      order by se.created_on DESC

        `)
    return List;
  }


  async StockEntryDetailById(StockEntryDetailId: string) {
    const List = await this._DataSource.query(`
  select
	se.id as stock_info_id,
	se.stock_entry_type as stock_info_stock_entry_type,
	se.stock_entry_date_time as stock_info_stock_entry_date_time,
	se.stock_number as stock_info_stock_number,
	se.hand_over_name as stock_info_hand_over_name,
	se.metal_id as stock_info_metal_id,
	se.purity_id as stock_info_purity_id,
	se.note as stock_info_note,
	se.business_id as stock_info_business,
      sed.*,
      c.name as category_name,
      c.id as category_id,
      uom.name as unit_name,
      (SELECT
              CONCAT(
                  '[',
                  GROUP_CONCAT(
                      JSON_OBJECT(
                          'id' ,sow.id,
                          'stock_entry_detail_id', sow.stock_entry_detail_id,
                          'product_mixed_material_id', sow.product_mixed_material_id,
                          'weight', sow.weight,
                          'amount', sow.amount,
                          'name', m.name
                          ) ORDER BY m.display_order ASC
                      ),
                  ']'
              )

              FROM
                  stock_entry_detail_other_weight sow
           inner join
                 product_mixed_material pmm
                on
                	pmm.id = sow.product_mixed_material_id
            INNER JOIN
              mixed_material AS m
            on
              m.id = pmm.mixed_material_id
              WHERE
                  sow.stock_entry_detail_id = sed.id
                          ) as mixed_material,
                  (SELECT
                CONCAT(
                    '[',
                    GROUP_CONCAT(
                        JSON_OBJECT(
                            'id' ,seh.id,
                            'stock_entry_detail_id', seh.stock_entry_detail_id,
                            'modified_by', seh.modified_by,
                            'modified_date', seh.modified_date,
                            'notes' , seh.notes,
                            'name' , u.email
                            )
                        ),
                    ']'
                )

                FROM
                    stock_entry_history seh
                inner join
                      user u
                    on
                      u.id = seh.modified_by
                WHERE
                    seh.stock_entry_detail_id = sed.id
                    order by seh.id DESC
                    ) as history
    FROM
      stock_entry_detail sed
     inner join
     	stock_entry se
     on
     	se.id = sed.stock_entry_id
     inner join
    	product p
    on
    	p.id = sed.product_id
    inner JOIN
    	category c
    on
    	c.id = p.category_id
    left outer JOIN
    	unit_of_measurement uom
    on
    	uom.id = p.unit_of_measurement_id
    WHERE
      sed.id = '${StockEntryDetailId}'
        `)
    return List;
  }

  // async OutwareStockProductList(StockEntryProductData) {
  //   const ProductList = await this._DataSource.query(`
  //   SELECT
  //     tbl.*,
  //     (tbl.inward - tbl.outward) as stock
  //   FROM
  //   (SELECT
  //           sed.product_id,
  //           p.name as product_name,
  //           p.product_code,
  //           p.category_id,
  //           c.name as category_name,
  //           u.name as unit_name,
  //           p.unit_of_measurement_id,
  //           if(sed.stock_entry_type = 'Inward' , SUM(sed.stock_qty) , 0) as inward,
  //           if(sed.stock_entry_type = 'Outward' , SUM(sed.stock_qty) , 0) as outward

  //         FROM
  //           stock_entry_detail sed
  //         inner join
  //           stock_entry se
  //         on
  //           se.id = sed.stock_entry_id
  //         INNER JOIN
  //           product p
  //         on
  //           p.id = sed.product_id
  //         inner JOIN
  //           category c
  //         on
  //           c.id = p.category_id
  //         inner JOIN
  //           unit_of_measurement u
  //         on
  //           u.id = p.unit_of_measurement_id
  //         WHERE

  //           p.metal_id = '${StockEntryProductData.metal_id}'
  //           and
  //           p.purity_id = '${StockEntryProductData.purity_id}'
  //         group by
  //           sed.product_id,
  //           sed.stock_entry_type) as tbl
  //     `)
  //     return ProductList;
  // };

  async IssueStockProductList(StockEntryProductData) {
    const ProductList = await this._DataSource.query(`
      SELECT
              sed.product_id,
              p.name as product_name,
              p.product_code,
              p.category_id,
              c.name as category_name,
              u.name as unit_name,
              p.unit_of_measurement_id,
              SUM(CASE
              WHEN se.stock_entry_type = 'Receipt' THEN sed.stock_qty
              WHEN se.stock_entry_type = 'Issue' THEN -sed.stock_qty
              ELSE 0
              END) AS stock,
              SUM(CASE
              WHEN se.stock_entry_type = 'Receipt' THEN sed.gross_weight
              WHEN se.stock_entry_type = 'Issue' THEN -sed.gross_weight
              ELSE 0
              END) AS gross_weight
            FROM
              stock_entry_detail sed
            inner join
              stock_entry se
            on
              se.id = sed.stock_entry_id
            INNER JOIN
              product p
            on
              p.id = sed.product_id
            inner JOIN
              category c
            on
              c.id = p.category_id
            inner JOIN
              unit_of_measurement u
            on
              u.id = p.unit_of_measurement_id
            WHERE

              p.metal_id = '${StockEntryProductData.metal_id}'
              and
              p.purity_id = '${StockEntryProductData.purity_id}'
            group by
              sed.product_id
        `)
    return ProductList;
  };

  // async OutwardVarientList(Product_id: string) {
  //   const List = await this._DataSource.query(`
  //  SELECT
  //   tbl.*,
  //   (tbl.inward - tbl.outward) as stock
  // FROM
  // (SELECT
  //   sed.product_variants_id,
  //   sed.combination,
  //   if(sed.stock_entry_type = 'Inward' , SUM(sed.stock_qty) , 0) as inward,
  //     if(sed.stock_entry_type = 'Outward' , SUM(sed.stock_qty) , 0) as outward
  // from
  //   stock_entry_detail sed
  // WHERE

  //   sed.product_id = '${Product_id}'
  // group by
  //   sed.product_variants_id,
  //   sed.combination,
  //   sed.stock_entry_type) as tbl
  //   WHERE
  // tbl.product_variants_id is not NULL
  //     `)
  //     return List;
  // }

  async IssueVarientList(Product_id: string) {
    const List = await this._DataSource.query(`
      SELECT
      tbl.*
    FROM
    (SELECT
      sed.product_variants_id,
      sed.combination,
      SUM(CASE
      WHEN se.stock_entry_type = 'Receipt' THEN sed.stock_qty
      WHEN se.stock_entry_type = 'Issue' THEN -sed.stock_qty
      ELSE 0
      END) AS stock,
      SUM(CASE
      WHEN se.stock_entry_type = 'Receipt' THEN sed.gross_weight
      WHEN se.stock_entry_type = 'Issue' THEN -sed.gross_weight
      ELSE 0
      END
      ) AS gross_weight
      from
      stock_entry_detail sed
      inner join
        stock_entry se
      on
        se.id = sed.stock_entry_id
    WHERE
      sed.product_id = '${Product_id}'
    group by
      sed.product_variants_id,
      sed.combination
      ) as tbl
      WHERE
		tbl.product_variants_id is not NULL
        `)
    return List;
  }

  async IssueMixedMaterialList(Product_id: string) {
    const List = await this._DataSource.query(`
     select
     pmm.id,
      pmm.product_id,
      pmm.mixed_material_id,
      mm.name
    FROM
      product_mixed_material pmm
    inner join
      mixed_material mm
    on
      mm.id = pmm.mixed_material_id
    WHERE
      pmm.product_id = '${Product_id}'
    ORDER BY
      mm.display_order ASC
        `)
    return List;
  }

}
