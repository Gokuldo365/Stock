import { Injectable } from '@nestjs/common';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { DataSource } from 'typeorm';
import { attribute_detail } from '@Root/Database/Table/Product/attribute_detail';
import { attribute } from '@Root/Database/Table/Product/attribute';
import { AttributeDetailModel } from '@Model/Product/AttributeDetail.model';
import { CommonService } from '../Common.service';

@Injectable()
export class AttributeDetailService {
  constructor(private _DataSource: DataSource, private _CommonService: CommonService) {
  }

  async GetAll() {
    const AttributeDetailList = await attribute_detail.find({ relations: ['attribute'] ,order:{display_order:'ASC'} });
    return AttributeDetailList;
  }

  async GetById(AttributeDetailId: string) {
    const AttributeDetailGetById = await attribute_detail.findOne({ where: { id: AttributeDetailId }, relations: ['attribute'],order:{display_order:'ASC'} });
    if (!AttributeDetailGetById) {
      throw new Error('Record not found')
    }
    return AttributeDetailGetById;
  }

  // async GetAttributeId(AttributeDetailId: string) {

  //   const AttributeDetailList = await this._DataSource.manager.createQueryBuilder(attribute,'a')
  // .select([
  //   'a.name as attribute_name',
  //   'ad.name as attribute_detail_name',
  //   'ad.display_order as display_order',
  //   'ad.id as attribute_detail_id',
  //   'a.id as attribute_id',
  //   'ad.att_type as attribute_type'
  // ])
  // .leftJoin('attribute_detail', 'ad', 'ad.attribute_id = a.id')
  // .andWhere('ad.attribute_id = :attribute_id', { attribute_id: AttributeDetailId })
  // .orderBy('ad.display_order', 'ASC')
  // const products = await AttributeDetailList.getRawMany();
  //   return products;
  // }

  async GetAttributeId(AttributeDetailId: string) {
    const AttributeDetailList = await this._DataSource.manager.createQueryBuilder(attribute, 'a')
      .select([
        'a.name as attribute_name',
        'ad.name as attribute_detail_name',
        'ad.att_value as attribute_detail_value',
        'ad.display_order as display_order',
        'ad.id as attribute_detail_id',
        'a.id as attribute_id',
        'ad.att_type as attribute_type',
        `CASE
           WHEN EXISTS (
             SELECT 1
             FROM product_variant_detail pvd
             WHERE pvd.attribute_detail_id = ad.id
           ) THEN 'true'
           ELSE 'false'
         END AS is_used`
      ])
      .leftJoin('attribute_detail', 'ad', 'ad.attribute_id = a.id')
      .where('ad.attribute_id = :attribute_id', { attribute_id: AttributeDetailId })
      .orderBy('ad.display_order', 'ASC');

    const products = await AttributeDetailList.getRawMany();
    return products;
  }


  async Insert(AttributeDetailData: AttributeDetailModel, UserId: string) {
    const _AttributeDetailData = new attribute_detail();
    _AttributeDetailData.name = AttributeDetailData.name.trimStart().trimEnd();
    _AttributeDetailData.attribute_id = AttributeDetailData.attribute_id;
    _AttributeDetailData.att_type = AttributeDetailData.att_type;
    _AttributeDetailData.att_prefix = AttributeDetailData.att_prefix;
    _AttributeDetailData.att_value = AttributeDetailData.att_value;
    _AttributeDetailData.att_suffix = AttributeDetailData.att_suffix;
    const nextDisplayOrder = await this._CommonService.getLastDisplayOrder('attribute_detail');
    _AttributeDetailData.display_order = nextDisplayOrder;
    _AttributeDetailData.created_by_id = UserId;
    _AttributeDetailData.created_on = new Date();
    await attribute_detail.insert(_AttributeDetailData);
    return _AttributeDetailData;
  }

  async Update(Id: string, AttributeDetailData: AttributeDetailModel, UserId: string) {
    const AttributeDetailUpdateData = await attribute_detail.findOne({ where: { id: Id } });
    if (!AttributeDetailUpdateData) {
      throw new Error('Record not found')
    }
    const nextDisplayOrderUpdate = await this._CommonService.getLastDisplayOrderUpdate('attribute_detail');
        if (AttributeDetailData.display_order > nextDisplayOrderUpdate) {
        throw new Error(`Display order cannot be greater than the current max (${nextDisplayOrderUpdate})`);
    }
    AttributeDetailUpdateData.name = AttributeDetailData.name.trimStart().trimEnd();
    AttributeDetailUpdateData.attribute_id = AttributeDetailData.attribute_id;
    AttributeDetailUpdateData.att_type = AttributeDetailData.att_type;
    AttributeDetailUpdateData.att_prefix = AttributeDetailData.att_prefix;
    AttributeDetailUpdateData.att_value = AttributeDetailData.att_value;
    AttributeDetailUpdateData.display_order = AttributeDetailData.display_order;
    AttributeDetailUpdateData.attribute_id = AttributeDetailData.attribute_id;
    AttributeDetailUpdateData.updated_by_id = UserId;
    AttributeDetailUpdateData.updated_on = new Date();
    await attribute_detail.update(Id, AttributeDetailUpdateData);
    return AttributeDetailUpdateData;
  }


  async Delete(Id: string) {
    const AttributeDetailData = await attribute_detail.findOne({ where: { id: Id } });
    if (!AttributeDetailData) {
      throw new Error(ResponseEnum.NotFound);
    }
    await AttributeDetailData.remove();
    return true;
  }
}
