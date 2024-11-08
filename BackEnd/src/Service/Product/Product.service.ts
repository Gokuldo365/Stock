import { Injectable } from '@nestjs/common';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { product } from '@Root/Database/Table/Product/product';
import {
  CatalogProductFilterModel,
  GlobalFilterModel,
  ProductFilterListModel,
  ProductModel,
} from '@Model/Product/Product.model';
import { DataSource } from 'typeorm';
import { product_mixed_material } from '@Root/Database/Table/Product/product_mixed_material';
import { CommonService } from '../Common.service';

@Injectable()
export class ProductService {
  constructor(private _DataSource: DataSource, private _CommonService: CommonService) {}

  async GetAll() {
    const ProductList = await product.find({ relations: ['category','purity','metal'], order:{display_order:'ASC'} });
    return ProductList;
  }

  async ProductFilterList(ProductFilterListData : ProductFilterListModel) {
    const ProductData = this._DataSource.manager.createQueryBuilder(product, 'p')
    .select([
      'm.name AS metal_name',
      'm.id AS metal_id',
      'p2.name AS purity_name',
      'p2.id AS purity_id',
      'c.name AS category_name',
      'c.id AS category_id',
      'p.name AS product_name',
      'p.id AS product_id',
      'p.product_code AS product_code',
      'p.product_type AS product_type',
      'p.description AS product_description',
      'p.display_order AS product_display_order',
      `CASE
              WHEN EXISTS (
                  SELECT 1
                  FROM stock_entry_detail sed
                  WHERE sed.product_id = p.id
              ) THEN 'true'
              ELSE 'false'
          END AS is_used`
    ])
    .innerJoin('category', 'c', 'c.id = p.category_id')
    .innerJoin('metal', 'm', 'm.id = p.metal_id')
    .innerJoin('purity', 'p2', 'p2.id = p.purity_id')
    .innerJoin('unit_of_measurement', 'uom', 'uom.id = p.unit_of_measurement_id')
    .orderBy('p.display_order', 'ASC');

    if (ProductFilterListData.metal_id) {
      ProductData.andWhere('p.metal_id = :metal_id', { metal_id: ProductFilterListData.metal_id });
    }

    if (ProductFilterListData.purity_id) {
      ProductData.andWhere('p.purity_id = :purity_id', { purity_id: ProductFilterListData.purity_id });
    }

    if (ProductFilterListData.category_id) {
      ProductData.andWhere('p.category_id = :category_id', { category_id: ProductFilterListData.category_id });
    }

    return await ProductData.getRawMany();
  }

  async GetById(ProductId: string) {
    const ProductGetById = await product.findOne({
      where: { id: ProductId },
      relations: ['category'],
      order:{display_order:'ASC'}
    });
    if (!ProductGetById) {
      throw new Error('Record not found');
    }
    return ProductGetById;
  }

  async Insert(ProductData: ProductModel, UserId: string) {
    const _ProductData = new product();
    _ProductData.name = ProductData.name;
    _ProductData.product_code = ProductData.product_code;
    _ProductData.category_id = ProductData.category_id;
    _ProductData.metal_id = ProductData.metal_id;
    _ProductData.purity_id = ProductData.purity_id;
    _ProductData.product_type = ProductData.product_type;
    _ProductData.description = ProductData.description;
    _ProductData.unit_of_measurement_id = ProductData.unit_of_measurement_id;
    const nextDisplayOrder = await this._CommonService.getLastDisplayOrder('product');
    _ProductData.display_order = nextDisplayOrder;
    _ProductData.melting = ProductData.melting;
    _ProductData.created_by_id = UserId;
    _ProductData.created_on = new Date();
    await product.insert(_ProductData);
    if ( ProductData.mixed_material_ids && ProductData.mixed_material_ids.length > 0) {
      for (let data of ProductData.mixed_material_ids) {
        let nextMixedDisplayOrder = await this._CommonService.getLastDisplayOrder('product_mixed_material');
        const _ProductMixedData = new product_mixed_material();
        _ProductMixedData.product_id = _ProductData.id;
        _ProductMixedData.mixed_material_id = data.mixed_materail_id;
        _ProductMixedData.display_order = nextMixedDisplayOrder;
        _ProductMixedData.created_by_id = UserId;
        _ProductMixedData.created_on = new Date();
        await product_mixed_material.insert(_ProductMixedData);
      }
    }
    return _ProductData;
  }

  async Update(Id: string, ProductData: ProductModel, UserId: string) {
    const ProductUpdateData = await product.findOne({ where: { id: Id } });
    if (!ProductUpdateData) {
      throw new Error('Record not found');
    }
    const nextDisplayOrderUpdate = await this._CommonService.getLastDisplayOrderUpdate('product');
        if (ProductData.display_order > nextDisplayOrderUpdate) {
        throw new Error(`Display order cannot be greater than the current max (${nextDisplayOrderUpdate})`);
    }
    ProductUpdateData.name = ProductData.name;
    ProductUpdateData.product_code = ProductData.product_code;
    ProductUpdateData.category_id = ProductData.category_id;
    ProductUpdateData.metal_id = ProductData.metal_id;
    ProductUpdateData.purity_id = ProductData.purity_id;
    ProductUpdateData.product_type = ProductData.product_type;
    ProductUpdateData.display_order = ProductData.display_order;
    ProductUpdateData.unit_of_measurement_id = ProductData.unit_of_measurement_id;
    ProductUpdateData.description = ProductData.description;
    ProductUpdateData.melting = ProductData.melting;
    ProductUpdateData.updated_by_id = UserId;
    ProductUpdateData.updated_on = new Date();
    await product.update(Id, ProductUpdateData);

      await product_mixed_material.delete({ product_id: Id });
      const maxMixedMaterialDisplayOrder = await this._CommonService.getLastDisplayOrderUpdate('product_mixed_material');
      for (let Data of ProductData.mixed_material_ids) {
        if (Data.display_order > maxMixedMaterialDisplayOrder) {
          throw new Error(`Mixed material display order cannot be greater than the current max (${maxMixedMaterialDisplayOrder})`);
      }
        const _ProductMixedData = new product_mixed_material();
        _ProductMixedData.product_id = Id;
        _ProductMixedData.mixed_material_id = Data.mixed_materail_id;
        _ProductMixedData.display_order = Data.display_order;
        _ProductMixedData.created_by_id = UserId;
        _ProductMixedData.created_on = new Date();
        await product_mixed_material.insert(_ProductMixedData);

    }
    return ProductUpdateData;
  }

  async Delete(Id: string) {
    const ProductData = await product.findOne({ where: { id: Id } });
    if (!ProductData) {
      throw new Error(ResponseEnum.NotFound);
    }
    await ProductData.remove();
    return true;
  }

  async GetMixedMaterialProductId(productId: string) {
    const ProductMixedMaterialData = this._DataSource.query(`
      SELECT
          pmm.id AS id,
          pmm.product_id AS product_id,
          pmm.mixed_material_id AS mixed_material_id,
          mm.name AS mixed_material_name,
          pmm.display_order as display_order
      FROM
          product_mixed_material pmm
      LEFT JOIN
          mixed_material mm ON pmm.mixed_material_id = mm.id
      WHERE
          pmm.product_id = '${productId}'
      ORDER BY
          pmm.display_order ASC;`);

    return ProductMixedMaterialData;
  }

async CatalogFilter(CatalogProductFilterModelData: CatalogProductFilterModel) {
  let query = `
    WITH cte (product_variants_id, attribute_id, attribute_detail_id, name, att_value) AS (
      SELECT
          pvd.product_variants_id,
          pvd.attribute_id,
          pvd.attribute_detail_id,
          a.name,
          ad.att_value
      FROM
          product_variant_detail pvd
      INNER JOIN
          attribute a ON a.id = pvd.attribute_id
      INNER JOIN
          attribute_detail ad ON ad.id = pvd.attribute_detail_id
    )
    SELECT
      p.id AS product_id,
      p.product_type AS product_type,
      p.name AS product_name,
      p.product_code AS product_code,
      p.metal_id AS metal_id,
      m.name AS metal_name,
      p.purity_id AS purity_id,
      p2.name AS purity_name,
      p.category_id AS category_id,
      c.name AS category_name,
      pv.id AS product_variants_id,
      (
          SELECT
              JSON_ARRAYAGG(pi.file_name)
          FROM
              product_image pi
          WHERE
              pi.product_id = p.id
      ) AS product_images,
      pv.combination AS product_combination,
      (
      SELECT
      SUM(CASE
      WHEN se.stock_entry_type = 'Receipt' THEN sed.stock_qty
      WHEN se.stock_entry_type = 'Issue' THEN -sed.stock_qty
      ELSE 0
      END) AS stock
      FROM
      stock_entry_detail sed
      INNER JOIN
      stock_entry se ON se.id = sed.stock_entry_id
      WHERE sed.product_variants_id  = pv.id
     ) as stock,
      0 as quantity

    FROM
      product_variants pv
    INNER JOIN
      product p ON p.id = pv.product_id
    INNER JOIN
      metal m ON m.id = p.metal_id
    INNER JOIN
      purity p2 ON p2.id = p.purity_id
    INNER JOIN
      category c ON c.id = p.category_id
    LEFT OUTER JOIN
      (SELECT * FROM cte) AS ct ON ct.product_variants_id = pv.id AND LOWER(TRIM(ct.name)) = 'size'
    LEFT OUTER JOIN
      (SELECT * FROM cte) AS cts ON cts.product_variants_id = pv.id AND LOWER(TRIM(cts.name)) = 'weight'
    WHERE 1=1
  `;

  if (CatalogProductFilterModelData.metal_id) {
    query += ` AND p.metal_id = '${CatalogProductFilterModelData.metal_id}'`;
  }

  if (CatalogProductFilterModelData.purity_id) {
    query += ` AND p.purity_id = '${CatalogProductFilterModelData.purity_id}'`;
  }

  if (CatalogProductFilterModelData.catagory_id) {
    query += ` AND p.category_id = '${CatalogProductFilterModelData.catagory_id}'`;
  }

  if (CatalogProductFilterModelData.sizes.length > 0) {
    const sizes = CatalogProductFilterModelData.sizes.map(size => `'${size}'`).join(', ');
    query += ` AND ct.attribute_detail_id IN (${sizes})`;
  }

  if (CatalogProductFilterModelData.weight_range_from !== undefined && CatalogProductFilterModelData.weight_range_to !== undefined) {
    query += ` AND CAST(cts.att_value AS DECIMAL(10,2)) BETWEEN ${CatalogProductFilterModelData.weight_range_from} AND ${CatalogProductFilterModelData.weight_range_to}`;
  }

  if (CatalogProductFilterModelData.name_code_filter) {
    query += ` AND (p.name LIKE '%${CatalogProductFilterModelData.name_code_filter}%' OR p.product_code LIKE '%${CatalogProductFilterModelData.name_code_filter}%')`;
  }

  if (CatalogProductFilterModelData.is_stock === true) {
    query += ` AND (
          SELECT SUM(CASE
              WHEN se.stock_entry_type = 'Receipt' THEN sed.stock_qty
              WHEN se.stock_entry_type = 'Issue' THEN -sed.stock_qty
              ELSE 0
              END)
          FROM stock_entry_detail sed
          INNER JOIN stock_entry se ON se.id = sed.stock_entry_id
          WHERE sed.product_variants_id = pv.id
      ) > 0 `;
  }

  query += ` UNION ALL
    SELECT
      p.id AS product_id,
      p.product_type AS product_type,
      p.name AS product_name,
      p.product_code AS product_code,
      p.metal_id AS metal_id,
      m.name AS metal_name,
      p.purity_id AS purity_id,
      p2.name AS purity_name,
      p.category_id AS category_id,
      c.name AS category_name,
      '' AS product_variants_id,
      (
          SELECT
              JSON_ARRAYAGG(pi.file_name)
          FROM
              product_image pi
          WHERE
              pi.product_id = p.id
      ) AS product_images,
      '' AS product_combination,
     (
      SELECT SUM(CASE
          WHEN se.stock_entry_type = 'Receipt' THEN sed.stock_qty
          WHEN se.stock_entry_type = 'Issue' THEN -sed.stock_qty
          ELSE 0
          END)
      FROM stock_entry_detail sed
      INNER JOIN stock_entry se ON se.id = sed.stock_entry_id
      WHERE sed.product_id = p.id
     ) as stock,
      0 as quantity
    FROM
      product p
    INNER JOIN
      metal m ON m.id = p.metal_id
    INNER JOIN
      purity p2 ON p2.id = p.purity_id
    INNER JOIN
      category c ON c.id = p.category_id
    WHERE
      p.product_type = 'IP'
  `;

  if (CatalogProductFilterModelData.metal_id) {
    query += ` AND p.metal_id = '${CatalogProductFilterModelData.metal_id}'`;
  }

  if (CatalogProductFilterModelData.purity_id) {
    query += ` AND p.purity_id = '${CatalogProductFilterModelData.purity_id}'`;
  }

  if (CatalogProductFilterModelData.catagory_id) {
    query += ` AND p.category_id = '${CatalogProductFilterModelData.catagory_id}'`;
  }

  if (CatalogProductFilterModelData.is_stock === true) {
    query += ` AND (
                  SELECT SUM(CASE
              WHEN se.stock_entry_type = 'Receipt' THEN sed.stock_qty
              WHEN se.stock_entry_type = 'Issue' THEN -sed.stock_qty
              ELSE 0
              END)
        FROM stock_entry_detail sed
        INNER JOIN stock_entry se ON se.id = sed.stock_entry_id
        WHERE sed.product_id = p.id
    ) > 0 `;
  }

  if (CatalogProductFilterModelData.name_code_filter) {
    query += ` AND (p.name LIKE '%${CatalogProductFilterModelData.name_code_filter}%' OR p.product_code LIKE '%${CatalogProductFilterModelData.name_code_filter}%')`;
  }

  const TotalCountQuery = `SELECT COUNT(*) AS totalCount FROM (${query}) AS CountTable`;

  query += ` LIMIT ${CatalogProductFilterModelData.take} OFFSET ${CatalogProductFilterModelData.skip}`;

  const Result = await this._DataSource.query(query);
  const TotalCount = await this._DataSource.query(TotalCountQuery);
  return {
    Data: Result,
    Count: TotalCount[0]
  };
}





async GlobalProductNameCodeFilter(GlobalFilterModel: GlobalFilterModel) {
  let query = `
    WITH cte (product_variants_id, attribute_id, attribute_detail_id, name, att_value) AS (
      SELECT
          pvd.product_variants_id,
          pvd.attribute_id,
          pvd.attribute_detail_id,
          a.name,
          ad.att_value
      FROM
          product_variant_detail pvd
      INNER JOIN
          attribute a ON a.id = pvd.attribute_id
      INNER JOIN
          attribute_detail ad ON ad.id = pvd.attribute_detail_id
    )
    SELECT
      p.id AS product_id,
      p.product_type AS product_type,
      p.name AS product_name,
      p.product_code AS product_code,
      p.metal_id AS metal_id,
      m.name AS metal_name,
      p.purity_id AS purity_id,
      p2.name AS purity_name,
      p.category_id AS category_id,
      c.name AS category_name,
      pv.id AS product_variants_id,
      (
          SELECT
              JSON_ARRAYAGG(pi.file_name)
          FROM
              product_image pi
          WHERE
              pi.product_id = p.id
      ) AS product_images,
      pv.combination AS product_combination,
        (
       	select
       	SUM(CASE
        WHEN se.stock_entry_type = 'Receipt' THEN sed.stock_qty
        WHEN se.stock_entry_type = 'Issue' THEN -sed.stock_qty
        ELSE 0
        END) AS stock
       	from
       		stock_entry_detail sed
                inner join
          stock_entry se
      on
          se.id = sed.stock_entry_id
       	where
       		sed.product_variants_id  = pv.id
       ) as stock,
        0 as quantity
    FROM
      product_variants pv
    INNER JOIN
      product p ON p.id = pv.product_id
    INNER JOIN
      metal m ON m.id = p.metal_id
    INNER JOIN
      purity p2 ON p2.id = p.purity_id
    INNER JOIN
      category c ON c.id = p.category_id
    LEFT OUTER JOIN
      (SELECT * FROM cte) AS ct ON ct.product_variants_id = pv.id AND LOWER(TRIM(ct.name)) = 'size'
    LEFT OUTER JOIN
      (SELECT * FROM cte) AS cts ON cts.product_variants_id = pv.id AND LOWER(TRIM(cts.name)) = 'weight'
    WHERE 1=1
  `;

  if (GlobalFilterModel.name_code_filter) {
    query += ` AND (p.name LIKE '%${GlobalFilterModel.name_code_filter}%' OR p.product_code LIKE '%${GlobalFilterModel.name_code_filter}%')`;
  }

  query += `
    UNION ALL
    SELECT
      p.id AS product_id,
      p.product_type AS product_type,
      p.name AS product_name,
      p.product_code AS product_code,
      p.metal_id AS metal_id,
      m.name AS metal_name,
      p.purity_id AS purity_id,
      p2.name AS purity_name,
      p.category_id AS category_id,
      c.name AS category_name,
      '' AS product_variants_id,
      (
          SELECT
              JSON_ARRAYAGG(pi.file_name)
          FROM
              product_image pi
          WHERE
              pi.product_id = p.id
      ) AS product_images,
      '' AS product_combination,
       (
       	select
        SUM(CASE
        WHEN se.stock_entry_type = 'Receipt' THEN sed.stock_qty
        WHEN se.stock_entry_type = 'Issue' THEN -sed.stock_qty
        ELSE 0
        END) AS stock
        from
       		stock_entry_detail sed
                inner join
          stock_entry se
      on
          se.id = sed.stock_entry_id
      where
         sed.product_id = p.id
       ) as stock,
        0 as quantity
    FROM
      product p
    INNER JOIN
      metal m ON m.id = p.metal_id
    INNER JOIN
      purity p2 ON p2.id = p.purity_id
    INNER JOIN
      category c ON c.id = p.category_id
    WHERE
      p.product_type = 'IP'
  `;

  if (GlobalFilterModel.name_code_filter) {
    query += ` AND (p.name LIKE '%${GlobalFilterModel.name_code_filter}%' OR p.product_code LIKE '%${GlobalFilterModel.name_code_filter}%')`;
  }

  const Result = await this._DataSource.query(query);

  return Result;

}


}
