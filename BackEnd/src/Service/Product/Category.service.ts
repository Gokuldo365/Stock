import { Injectable } from '@nestjs/common';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { category } from '@Root/Database/Table/Product/category';
import { CategoryModel } from '@Model/Product/Category.model';
import { DataSource } from 'typeorm';
import { CommonService } from '../Common.service';

@Injectable()
export class CategoryService {
    constructor(private _DataSource: DataSource, private _CommonService: CommonService) {
    }

    async GetAll() {
      const CategoryList = await category.find({relations: ['metal'], order:{display_order:'ASC'} });
        return CategoryList;
    };

//     async GetAllCatagoyList(){
//       const AllCatagoryList = await this._DataSource.query(`
//           SELECT
//     pc.id,
//     pc.status,
//     pc.created_by_id,
//     pc.created_on,
//     pc.updated_by_id,
//     pc.updated_on,
//     pc.parent_category_id,
//     (CASE WHEN pc.parent_category_id IS NULL
//           THEN '--- Main Catagory ---'
//           ELSE (SELECT pc1.name FROM category AS pc1 WHERE pc1.id = pc.parent_category_id)
//      END) AS parent_category_name,
//     pc.name,
//     m.name as metal_name,
//     CONCAT(
//         IFNULL(pc4.name, ''),
//         CASE WHEN pc4.name IS NOT NULL THEN ' >> ' ELSE '' END,
//         IFNULL(pc3.name, ''),
//         CASE WHEN pc3.name IS NOT NULL THEN ' >> ' ELSE '' END,
//         IFNULL(pc2.name, ''),
//         CASE WHEN pc2.name IS NOT NULL THEN ' >> ' ELSE '' END,
//         pc.name
//     ) AS dropdown_label
// FROM
//     category pc
// LEFT OUTER JOIN
//     category pc2 ON pc2.id = pc.parent_category_id
// LEFT OUTER JOIN
//     category pc3 ON pc3.id = pc2.parent_category_id
// LEFT OUTER JOIN
//     category pc4 ON pc4.id = pc3.parent_category_id
// LEFT OUTER JOIN
//     metal m ON m.id = pc.metal_id;
//         `)

//         return AllCatagoryList;
//     }
async GetAllCatagoyList() {
  const AllCatagoryList = await this._DataSource.query(`
      SELECT
          pc.id,
          pc.status,
          pc.display_order,
          pc.created_by_id,
          pc.created_on,
          pc.updated_by_id,
          pc.updated_on,
          pc.parent_category_id,
          pc.is_stock_category,
          (CASE
              WHEN pc.parent_category_id IS NULL
              THEN '--- Main Category ---'
              ELSE (SELECT pc1.name FROM category AS pc1 WHERE pc1.id = pc.parent_category_id)
           END) AS parent_category_name,
          pc.name,
          m.name AS metal_name,
          m.id AS metal_id,
          CONCAT(
              IFNULL(pc4.name, ''),
              CASE WHEN pc4.name IS NOT NULL THEN ' >> ' ELSE '' END,
              IFNULL(pc3.name, ''),
              CASE WHEN pc3.name IS NOT NULL THEN ' >> ' ELSE '' END,
              IFNULL(pc2.name, ''),
              CASE WHEN pc2.name IS NOT NULL THEN ' >> ' ELSE '' END,
              pc.name
          ) AS dropdown_label,
          CASE
              WHEN EXISTS (
                  SELECT 1
                  FROM product p
                  WHERE p.category_id = pc.id
              ) THEN 'true'
              ELSE 'false'
          END AS is_used
      FROM
          category pc
      LEFT OUTER JOIN
          category pc2 ON pc2.id = pc.parent_category_id
      LEFT OUTER JOIN
          category pc3 ON pc3.id = pc2.parent_category_id
      LEFT OUTER JOIN
          category pc4 ON pc4.id = pc3.parent_category_id
      LEFT OUTER JOIN
          metal m ON m.id = pc.metal_id
      ORDER BY display_order ASC;
  `);

  return AllCatagoryList;
}



//     async GetAllCatagoy() {
//       const Category = await this._DataSource.query(`
// WITH RECURSIVE pc_cat AS (
//   SELECT c.id, c.parent_category_id, c.name, c.name AS path
//   FROM category AS c
//   WHERE c.parent_category_id IS NULL
//   UNION ALL
//   SELECT c1.id, c1.parent_category_id, c1.name, CONCAT(pc_cat.path, ' >> ', c1.name) AS path
//   FROM category AS c1
//   INNER JOIN pc_cat ON c1.parent_category_id = pc_cat.id
// )
// SELECT id, path AS name
// FROM pc_cat
// ORDER BY path;
//         `)
//         return Category;
//     };

async GetAllCatagoy() {
  const Category = await this._DataSource.query(`
   WITH RECURSIVE pc_cat AS (
    SELECT
      c.id,
      c.parent_category_id,
      c.name,
      c.is_stock_category,
      c.display_order,  -- Ensure display_order is correctly selected as an integer
      c.name AS path
    FROM
      category AS c
    WHERE
      c.parent_category_id IS NULL
    UNION ALL
    SELECT
      c1.id,
      c1.parent_category_id,
      c1.name,
      c1.is_stock_category,
      c1.display_order,  -- Ensure display_order is correctly selected as an integer
      CONCAT(pc_cat.path, ' >> ', c1.name) AS path
    FROM
      category AS c1
    INNER JOIN
      pc_cat ON c1.parent_category_id = pc_cat.id
)
SELECT
  pc_cat.id,
  pc_cat.path AS name,
  pc_cat.is_stock_category AS is_stock_category,
  pc_cat.display_order,  -- Keep display_order as an integer value
  CASE
    WHEN EXISTS (
      SELECT 1
      FROM product p
      WHERE p.category_id = pc_cat.id
    ) THEN 'true'
    ELSE 'false'
  END AS is_used
FROM
  pc_cat
ORDER BY
  pc_cat.path, pc_cat.display_order ASC;
  `);

  return Category;
}

    async GetById(CategoryId: string) {
        const CategoryGetById = await category.findOne({ where: { id: CategoryId }, relations: ['metal'], order:{display_order:'ASC'} });
        if (!CategoryGetById) {
            throw new Error('Record not found')
        }
        return CategoryGetById;
    }

    async Insert(CategoryData: CategoryModel, UserId: string) {
      const _CategoryData = new category();
      _CategoryData.name = CategoryData.name.trim();
      _CategoryData.metal_id = CategoryData.metal_id;
      _CategoryData.code = CategoryData.code;
      _CategoryData.is_stock_category = CategoryData.is_stock_category;
      const nextDisplayOrder = await this._CommonService.getLastDisplayOrder('category');
      _CategoryData.display_order = nextDisplayOrder;
      _CategoryData.created_by_id = UserId;
      _CategoryData.created_on = new Date();
      if (CategoryData.parent_category_id) {
          const parentCategory = await category.findOne({ where: { id: CategoryData.parent_category_id } });
          if (parentCategory) {
              _CategoryData.parent_category_id = CategoryData.parent_category_id;
          }
      }
        await category.insert(_CategoryData);
        return _CategoryData;
    }

    async Update(Id: string, CategoryData: CategoryModel, UserId: string) {
      const CategoryUpdateData = await category.findOne({ where: { id: Id } });
      if (!CategoryUpdateData) {
        throw new Error('Category not found');
      }
      const nextDisplayOrderUpdate = await this._CommonService.getLastDisplayOrderUpdate('category');
        if (CategoryData.display_order > nextDisplayOrderUpdate) {
        throw new Error(`Display order cannot be greater than the current max (${nextDisplayOrderUpdate})`);
     }
      CategoryUpdateData.name = CategoryData.name.trim();
      CategoryUpdateData.metal_id = CategoryData.metal_id;
      CategoryUpdateData.code = CategoryData.code;
      CategoryUpdateData.is_stock_category = CategoryData.is_stock_category;
      CategoryUpdateData.display_order = CategoryData.display_order;
      CategoryUpdateData.updated_by_id = UserId;
      CategoryUpdateData.updated_on = new Date();
      if (CategoryData.parent_category_id) {
        const parentCategory = await category.findOne({ where: { id: CategoryData.parent_category_id } });
        if (parentCategory) {
          CategoryUpdateData.parent_category_id = CategoryData.parent_category_id;
        }
      }
        await category.update(Id, CategoryUpdateData);
        return CategoryUpdateData;
    }

    async Delete(Id: string) {
      const CategoryData = await category.findOne({ where: { id: Id } });
      if (!CategoryData) {
        throw new Error(ResponseEnum.NotFound);
      }
      await CategoryData.remove();
      return true;
    }
}
