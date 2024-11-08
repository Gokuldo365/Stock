import { Injectable } from '@nestjs/common';
import { ResponseEnum } from '@Helper/Enum/ResponseEnum';
import { product_variant_detail } from '@Root/Database/Table/Product/product_variant_detail';
import { product_variants } from '@Root/Database/Table/Product/product_variant';
import { ProductVariantsModel } from '@Model/Product/ProductVariants.model';
import { CommonService } from '../Common.service';

@Injectable()
export class ProductVariantsService {
    constructor(private _CommonService: CommonService) {
    }

    async GetAll() {
        const ProductVariantsList = await product_variants.find({order:{display_order:'ASC'}});
        return ProductVariantsList;
    }

    async GetById(ProductVariantsId: string) {
        const ProductVariantsGetById = await product_variants.findOne({ where: { id: ProductVariantsId },order:{display_order:'ASC'} });
        if (!ProductVariantsGetById) {
            throw new Error('Record not found')
        }
        return ProductVariantsGetById;
    }

    async ProductVariantsListByProductId(ProductId: string) {
        const ProductVariantsListByProductIdData = await product_variants.find({ where: { product_id: ProductId },order:{display_order:'ASC'} });
        if (!ProductVariantsListByProductIdData) {
            throw new Error('Record not found')
        }
        return ProductVariantsListByProductIdData;
    }


    async Insert(ProductVariantsData: ProductVariantsModel, UserId: string) {
      const InsertedProductVariantss = [];
      for (const ProductVariants of ProductVariantsData.combination) {
        const _ProductVariantsData = new product_variants();
        _ProductVariantsData.product_id = ProductVariantsData.product_id;
        _ProductVariantsData.combination = ProductVariants.value;
        const nextDisplayOrder = await this._CommonService.getLastDisplayOrder('product_variants');
        _ProductVariantsData.display_order = nextDisplayOrder;
        _ProductVariantsData.created_by_id = UserId;
        _ProductVariantsData.created_on = new Date();
        await product_variants.insert(_ProductVariantsData);
        const ProductVariantsInsertData = _ProductVariantsData
       InsertedProductVariantss.push(ProductVariantsInsertData);


const maxLength = Math.max(ProductVariants.attribute_ids.length, ProductVariants.attribute_detail_ids.length);
let nextDetailDisplayOrder = await this._CommonService.getLastDisplayOrder('product_variant_detail');
for (let i = 0; i < maxLength; i++) {
  const AttributeandDetailData: any = {};
  AttributeandDetailData.product_variants_id   = _ProductVariantsData.id;
  AttributeandDetailData.attribute_id = ProductVariants.attribute_ids[i % ProductVariants.attribute_ids.length]; // Handles overflow
  AttributeandDetailData.attribute_detail_id = ProductVariants.attribute_detail_ids[i % ProductVariants.attribute_detail_ids.length]; // Handles overflow
  AttributeandDetailData.display_order = nextDetailDisplayOrder;
  AttributeandDetailData.created_by_id = UserId;
  AttributeandDetailData.created_on = new Date();
  await product_variant_detail.insert(AttributeandDetailData);
}


       }

      return InsertedProductVariantss.map(o=>o.id);
    }



    // async Update(Id: string, ProductVariantsData: ProductVariantsModel, UserId: string) {
    //     const ProductVariantsUpdateData = await variant.findOne({ where: { id: Id } });
    //     if (!ProductVariantsUpdateData) {
    //         throw new Error('Record not found')
    //     }
    //     ProductVariantsUpdateData.product_id = ProductVariantsData.product_id;
    //     ProductVariantsUpdateData.combination = ProductVariantsData.combination;
    //     ProductVariantsUpdateData.display_order = ProductVariantsData.display_order;
    //     ProductVariantsUpdateData.updated_by_id = UserId;
    //     ProductVariantsUpdateData.updated_on = new Date();
    //     await variant.update(Id, ProductVariantsUpdateData);
    //     return ProductVariantsUpdateData;
    // }

    async Delete(Id: string) {
      const ProductVariantsData = await product_variants.findOne({ where: { id: Id } });
      if (!ProductVariantsData) {
        throw new Error(ResponseEnum.NotFound);
      }
      await ProductVariantsData.remove();
      return true;
    }
}
