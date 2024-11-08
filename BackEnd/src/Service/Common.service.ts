import { ModuleTypeEnum } from "@Helper/Enum/ModuleTypeEnum";
import { Injectable } from "@nestjs/common";
import fs from 'fs';
import path from 'path';
import { CacheService } from "./Cache.service";
import { metal } from "@Root/Database/Table/Product/metal";
import { attribute } from "@Root/Database/Table/Product/attribute";
import { attribute_detail } from "@Root/Database/Table/Product/attribute_detail";
import { business } from "@Root/Database/Table/Product/business";
import { branch } from "@Root/Database/Table/Product/branch";
import { business_category } from "@Root/Database/Table/Product/business_category";
import { category } from "@Root/Database/Table/Product/category";
import { employee } from "@Root/Database/Table/Product/employee";
import { mixed_material } from "@Root/Database/Table/Product/mixed_material";
import { product_image } from "@Root/Database/Table/Product/product_image";
import { product_mixed_material } from "@Root/Database/Table/Product/product_mixed_material";
import { product_variant_detail } from "@Root/Database/Table/Product/product_variant_detail";
import { product_variants } from "@Root/Database/Table/Product/product_variant";
import { product } from "@Root/Database/Table/Product/product";
import { purity } from "@Root/Database/Table/Product/purity";
import { unit_of_measurement } from "@Root/Database/Table/Product/unit_of_measurement";
@Injectable()
export class CommonService {
  constructor(

    private _CacheService: CacheService) {
  }

  async TransactionRunningNumber(ModuleType: ModuleTypeEnum) {
    let ModuleNumberData: any = {};
    let LastNumber: string = "1";
    // if (ModuleType == ModuleTypeEnum.Quotation) {
    //   ModuleNumberData = await getManager().query(`SELECT qo_number AS module_number FROM quotation ORDER BY DATE(created_on) DESC, id DESC, CAST(REGEXP_REPLACE(qo_number,'[^0-9]','0') as unsigned) DESC LIMIT 1`);
    //   if (ModuleNumberData.length > 0) {
    //     return this.AutoGenerateNumber(ModuleNumberData[0].module_number)
    //   }
    //   else {
    //     return "1";
    //   }
    // }
  }
  async ClearAllCache() {
    await this._CacheService.Flush();
  }

  RoundDecimal(value: number, scale: number = 2) {
    return Number(value.toFixed(scale));
  }


  GetBase64(FilePath: string) {
    var bitmap = fs.readFileSync(path.resolve(FilePath), 'base64');
    return bitmap;
  }

  AutoGenerateNumber(value: string) {
    let last_charater = value.charAt(value.length - 1);
    let parsedvalue = parseInt(last_charater);
    if (parsedvalue == null || parsedvalue == undefined || isNaN(parsedvalue)) {
      value = value + "0";
    }
    return this.InvoiceAutoGenerateNext(value);
  }

  private InvoiceAutoGenerateNext(invoiceNumber: string) {
    const array = invoiceNumber.split(/[_/:\/\W/;\\]+/);
    const lastSegment = array.pop() || '';
    const priorSegment = invoiceNumber.substring(0, invoiceNumber.lastIndexOf(lastSegment));
    const nextNumber = this.alphaNumericIncrementer(lastSegment);
    return priorSegment + nextNumber;
  }

  private alphaNumericIncrementer(str: string) {
    if (str && str.length > 0) {
      let invNum = str.replace(/([^a-z0-9]+)/gi, '');
      invNum = invNum.toUpperCase();
      let index = invNum.length - 1;
      while (index >= 0) {
        if (invNum.substring(index, index + 1) === '9') {
          if (Number(invNum.substring(0, index)) > 0 || invNum.substring(0, index) == '') {
            invNum = (invNum.substring(0, index) ? invNum.substring(0, index) : '1') + '0' + invNum.substring(index + 1)
          }
          else {
            invNum = (invNum.substring(0, index) ? invNum.substring(0, index) + (!(Number(invNum.substring(index - 1, index)) >= 0) ? '1' : '') : '1') + '0' + invNum.substring(index + 1)
          }
        }
        else if (invNum.substring(index, index + 1) === 'Z') {
          invNum = invNum.substring(0, index) + 'A' + invNum.substring(index + 1);
        } else {
          const char = String.fromCharCode(invNum.charCodeAt(index) + 1)
          if (Number(char) >= 0) {
            invNum = invNum.substring(0, index) + char + invNum.substring(index + 1);
          }
          index = 0;
        }
        index--;
      }
      return invNum;
    } else {
      throw new Error('str cannot be empty')
    }
  }

    async getLastDisplayOrder(Type: string) {
      let lastDisplayOrder = 0;

      if (Type === 'metal') {
          const metalRecord = await metal.createQueryBuilder('metal')
              .select('MAX(metal.display_order)', 'max')
              .getRawOne();
          lastDisplayOrder = metalRecord?.max || 0;
      } else if (Type === 'attribute') {
          const attributeRecord = await attribute.createQueryBuilder('attribute')
              .select('MAX(attribute.display_order)', 'max')
              .getRawOne();
          lastDisplayOrder = attributeRecord?.max || 0;
      } else if (Type === 'attribute_detail') {
          const attributeDetailRecord = await attribute_detail.createQueryBuilder('attribute_detail')
              .select('MAX(attribute_detail.display_order)', 'max')
              .getRawOne();
          lastDisplayOrder = attributeDetailRecord?.max || 0;
      } else if (Type === 'business') {
          const businessRecord = await business.createQueryBuilder('business')
              .select('MAX(business.display_order)', 'max')
              .getRawOne();
          lastDisplayOrder = businessRecord?.max || 0;
      } else if (Type === 'branch') {
        const branchRecord = await branch.createQueryBuilder('branch')
            .select('MAX(branch.display_order)', 'max')
            .getRawOne();
        lastDisplayOrder = branchRecord?.max || 0;
      } else if (Type === 'business_category') {
        const businessCategoryRecord = await business_category.createQueryBuilder('business_category')
          .select('MAX(business_category.display_order)', 'max')
          .getRawOne();
        lastDisplayOrder = businessCategoryRecord?.max || 0;
      } else if (Type === 'business_category') {
         const businessCategoryRecord = await business_category.createQueryBuilder('business_category')
        .select('MAX(business_category.display_order)', 'max')
        .getRawOne();
         lastDisplayOrder = businessCategoryRecord?.max || 0;
      } else if (Type === 'category') {
          const categoryRecord = await category.createQueryBuilder('category')
          .select('MAX(category.display_order)', 'max')
          .getRawOne();
         lastDisplayOrder = categoryRecord?.max || 0;
      } else if (Type === 'employee') {
        const employeeRecord = await employee.createQueryBuilder('employee')
       .select('MAX(employee.display_order)', 'max')
       .getRawOne();
        lastDisplayOrder = employeeRecord?.max || 0;
     } else if (Type === 'mixed_material') {
       const mixedMaterialRecord = await mixed_material.createQueryBuilder('mixed_material')
       .select('MAX(mixed_material.display_order)', 'max')
       .getRawOne();
       lastDisplayOrder = mixedMaterialRecord?.max || 0;
     } else if (Type === 'product_image') {
       const productImageRecord = await product_image.createQueryBuilder('product_image')
       .select('MAX(product_image.display_order)', 'max')
       .getRawOne();
       lastDisplayOrder = productImageRecord?.max || 0;
     } else if (Type === 'product_mixed_material') {
       const productMixedMaterialRecord = await product_mixed_material.createQueryBuilder('product_mixed_material')
       .select('MAX(product_mixed_material.display_order)', 'max')
       .getRawOne();
       lastDisplayOrder = productMixedMaterialRecord?.max || 0;
     } else if (Type === 'product_variant_detail') {
       const productVariantDetailRecord = await product_variant_detail.createQueryBuilder('product_variant_detail')
       .select('MAX(product_variant_detail.display_order)', 'max')
       .getRawOne();
       lastDisplayOrder = productVariantDetailRecord?.max || 0;
     } else if (Type === 'product_variants') {
        const productVariantsRecord = await product_variants.createQueryBuilder('product_variants')
        .select('MAX(product_variants.display_order)', 'max')
        .getRawOne();
        lastDisplayOrder = productVariantsRecord?.max || 0;
     } else if (Type === 'product') {
       const productRecord = await product.createQueryBuilder('product')
       .select('MAX(product.display_order)', 'max')
       .getRawOne();
       lastDisplayOrder = productRecord?.max || 0;
    } else if (Type === 'purity') {
        const purityRecord = await purity.createQueryBuilder('purity')
        .select('MAX(purity.display_order)', 'max')
        .getRawOne();
        lastDisplayOrder = purityRecord?.max || 0;
    } else if (Type === 'unit_of_measurement') {
        const unitOfMeasurementRecord = await unit_of_measurement.createQueryBuilder('unit_of_measurement')
        .select('MAX(unit_of_measurement.display_order)', 'max')
        .getRawOne();
        lastDisplayOrder = unitOfMeasurementRecord?.max || 0;
    } else {
          throw new Error('Invalid table for display order auto increment');
      }

      return lastDisplayOrder + 1;
  }

  async getLastDisplayOrderUpdate(Type: string) {
    let lastDisplayOrder = 0;

    if (Type === 'metal') {
        const metalRecord = await metal.createQueryBuilder('metal')
            .select('MAX(metal.display_order)', 'max')
            .getRawOne();
        lastDisplayOrder = metalRecord?.max || 0;
    } else if (Type === 'attribute') {
        const attributeRecord = await attribute.createQueryBuilder('attribute')
            .select('MAX(attribute.display_order)', 'max')
            .getRawOne();
        lastDisplayOrder = attributeRecord?.max || 0;
    } else if (Type === 'attribute_detail') {
        const attributeDetailRecord = await attribute_detail.createQueryBuilder('attribute_detail')
            .select('MAX(attribute_detail.display_order)', 'max')
            .getRawOne();
        lastDisplayOrder = attributeDetailRecord?.max || 0;
    } else if (Type === 'business') {
        const businessRecord = await business.createQueryBuilder('business')
            .select('MAX(business.display_order)', 'max')
            .getRawOne();
        lastDisplayOrder = businessRecord?.max || 0;
    } else if (Type === 'branch') {
      const branchRecord = await branch.createQueryBuilder('branch')
          .select('MAX(branch.display_order)', 'max')
          .getRawOne();
      lastDisplayOrder = branchRecord?.max || 0;
    } else if (Type === 'business_category') {
      const businessCategoryRecord = await business_category.createQueryBuilder('business_category')
        .select('MAX(business_category.display_order)', 'max')
        .getRawOne();
      lastDisplayOrder = businessCategoryRecord?.max || 0;
    } else if (Type === 'business_category') {
       const businessCategoryRecord = await business_category.createQueryBuilder('business_category')
      .select('MAX(business_category.display_order)', 'max')
      .getRawOne();
       lastDisplayOrder = businessCategoryRecord?.max || 0;
    } else if (Type === 'category') {
        const categoryRecord = await category.createQueryBuilder('category')
        .select('MAX(category.display_order)', 'max')
        .getRawOne();
       lastDisplayOrder = categoryRecord?.max || 0;
    } else if (Type === 'employee') {
      const employeeRecord = await employee.createQueryBuilder('employee')
     .select('MAX(employee.display_order)', 'max')
     .getRawOne();
      lastDisplayOrder = employeeRecord?.max || 0;
   } else if (Type === 'mixed_material') {
     const mixedMaterialRecord = await mixed_material.createQueryBuilder('mixed_material')
     .select('MAX(mixed_material.display_order)', 'max')
     .getRawOne();
     lastDisplayOrder = mixedMaterialRecord?.max || 0;
   } else if (Type === 'product_image') {
     const productImageRecord = await product_image.createQueryBuilder('product_image')
     .select('MAX(product_image.display_order)', 'max')
     .getRawOne();
     lastDisplayOrder = productImageRecord?.max || 0;
   } else if (Type === 'product_mixed_material') {
     const productMixedMaterialRecord = await product_mixed_material.createQueryBuilder('product_mixed_material')
     .select('MAX(product_mixed_material.display_order)', 'max')
     .getRawOne();
     lastDisplayOrder = productMixedMaterialRecord?.max || 0;
   } else if (Type === 'product_variant_detail') {
     const productVariantDetailRecord = await product_variant_detail.createQueryBuilder('product_variant_detail')
     .select('MAX(product_variant_detail.display_order)', 'max')
     .getRawOne();
     lastDisplayOrder = productVariantDetailRecord?.max || 0;
   } else if (Type === 'product_variants') {
      const productVariantsRecord = await product_variants.createQueryBuilder('product_variants')
      .select('MAX(product_variants.display_order)', 'max')
      .getRawOne();
      lastDisplayOrder = productVariantsRecord?.max || 0;
   } else if (Type === 'product') {
     const productRecord = await product.createQueryBuilder('product')
     .select('MAX(product.display_order)', 'max')
     .getRawOne();
     lastDisplayOrder = productRecord?.max || 0;
  } else if (Type === 'purity') {
      const purityRecord = await purity.createQueryBuilder('purity')
      .select('MAX(purity.display_order)', 'max')
      .getRawOne();
      lastDisplayOrder = purityRecord?.max || 0;
  } else if (Type === 'unit_of_measurement') {
      const unitOfMeasurementRecord = await unit_of_measurement.createQueryBuilder('unit_of_measurement')
      .select('MAX(unit_of_measurement.display_order)', 'max')
      .getRawOne();
      lastDisplayOrder = unitOfMeasurementRecord?.max || 0;
  } else {
        throw new Error('Invalid table for display order auto increment');
    }

    return lastDisplayOrder;
}
}
