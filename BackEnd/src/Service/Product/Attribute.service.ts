import { Injectable } from '@nestjs/common';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { CacheService } from '@Service/Cache.service';
import { CacheEnum } from '@Helper/Enum/CacheEnum';
import * as _ from 'lodash';
import { DataSource } from 'typeorm';
import { attribute } from '@Root/Database/Table/Product/attribute';
import { AttributeModel } from '@Model/Product/Attribute.model';
import { CommonService } from '../Common.service';

@Injectable()
export class AttributeService {
  constructor(
    private _CacheService: CacheService,
    private _DataSource: DataSource,
    private _CommonService: CommonService,
  ) {
  }

  async GetAll() {
    const AttributeList = await attribute.find({order:{display_order:'ASC'}});
    return AttributeList
  }


  async GetById(AttributeId: string) {
    const AttributeGetById = await attribute.findOne({ where: { id: AttributeId },order:{display_order:'ASC'}});
    if (!AttributeGetById) {
      throw new Error('Record not found')
    }
      return AttributeGetById;
    }


  async Insert(AttributeData: AttributeModel, UserId: string) {
    const _AttributeData = new attribute();
    _AttributeData.name = AttributeData.name.trimStart().trimEnd();
    const nextDisplayOrder = await this._CommonService.getLastDisplayOrder('attribute');
    _AttributeData.display_order = nextDisplayOrder;
    _AttributeData.created_by_id = UserId;
    _AttributeData.created_on = new Date();
    await attribute.insert(_AttributeData);
    await this._CacheService.Store(`${CacheEnum.Attribute}`, [_AttributeData]);
    return _AttributeData;
  }

  async Update(Id: string, AttributeData: AttributeModel, UserId: string) {
    const AttributeUpdateData = await attribute.findOne({ where: { id: Id } });
    if (!AttributeUpdateData) {
      throw new Error('Record not found')
    }
    const nextDisplayOrderUpdate = await this._CommonService.getLastDisplayOrderUpdate('attribute');
        if (AttributeData.display_order > nextDisplayOrderUpdate) {
        throw new Error(`Display order cannot be greater than the current max (${nextDisplayOrderUpdate})`);
    }
    AttributeUpdateData.name = AttributeData.name.trimStart().trimEnd();
    AttributeUpdateData.display_order = AttributeData.display_order;
    AttributeUpdateData.updated_by_id = UserId;
    AttributeUpdateData.updated_on = new Date();
    await attribute.update(Id, AttributeUpdateData);
    await this._CacheService.Store(`${CacheEnum.Attribute}`, [{ ...AttributeUpdateData, id: Id }]);
    return AttributeUpdateData;
  }

  async Delete(Id: string) {
    const AttributeData = await attribute.findOne({ where: { id: Id } });
    if (!AttributeData) {
      throw new Error(ResponseEnum.NotFound);
    }
    await AttributeData.remove();
    return true;
  }

  // async AttributeDetailFullList() {
  //   const List = await this._DataSource.query(`
  //  SELECT
  //   a.id,
  //   a.status,
  //   a.name,
  //   a.display_order,
  //   (SELECT
  //     CONCAT(
  //         '[',
  //         GROUP_CONCAT(
  //             JSON_OBJECT(
  //                 'id' ,ad.id,
  //                 'name' , ad.name

  //                 )
  //             ),
  //         ']'
  //     )

  //     FROM
  //         attribute_detail ad
  //     WHERE
  //         ad.attribute_id = a.id) as detail_entry,
  //          (
  //          select
  //             GROUP_CONCAT(pi.name)
  //          from
  //              attribute_detail pi
  //          where
  //              pi.attribute_id = a.id
  //           ) as detail
  // FROM
  //   attribute AS a


  //     `)
  //     return List;
  // }

  async AttributeDetailFullList() {
    const List = await this._DataSource.query(`
      SELECT
        a.id,
        a.status,
        a.name,
        a.display_order,
        (
          SELECT
            CONCAT(
              '[',
              GROUP_CONCAT(
                JSON_OBJECT(
                  'id', ad.id,
                  'name', ad.name
                )
              ),
              ']'
            )
          FROM
            attribute_detail ad
          WHERE
            ad.attribute_id = a.id
        ) AS detail_entry,
        (
          SELECT
            GROUP_CONCAT(pi.name  ORDER BY pi.display_order ASC)
          FROM
            attribute_detail pi
          WHERE
            pi.attribute_id = a.id
        ) AS detail,
        CASE
          WHEN EXISTS (
            SELECT 1
            FROM attribute_detail ad
            WHERE ad.attribute_id = a.id
          ) THEN 'true'
          ELSE 'false'
        END AS is_used
      FROM
        attribute AS a
      ORDER BY
      a.display_order ASC;
    `);

    return List;
  }

}
