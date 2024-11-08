import { BaseModel } from "@Model/Base.model";
import { ApiProperty } from "@nestjs/swagger";
import { productTypeEnum } from "@Root/Helper/Enum/InwardTypeEnum";
import { Type } from "class-transformer";
import {  IsNotEmpty, isNotEmpty, ValidateNested } from "class-validator";


export class MixedMaterailProductListModel {

  @ApiProperty({ required: false })
  @Type(() => String)
  mixed_materail_id: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  display_order: number;

  }



export class ProductModel extends BaseModel {

    @IsNotEmpty({ message: "Name required" })
    @ApiProperty({ required: true })
    @Type(() => String)
    name: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    product_code: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    category_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    metal_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    purity_id: string;

    @ApiProperty({ required: false, enum: productTypeEnum })
    @Type(() => String)
    product_type: productTypeEnum ;

    @ApiProperty({ required: false })
    @Type(() => Number)
    display_order: number;

    @ApiProperty({ required: false })
    @Type(() => String)
    description: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    unit_of_measurement_id: string;

    @ApiProperty({ required: false })
    @Type(() => Number)
    melting: number;

    @ApiProperty({ required: false })
    @ValidateNested({ each: true })
    @Type(() => MixedMaterailProductListModel)
    @ApiProperty({ type: [MixedMaterailProductListModel], required: true })
    mixed_material_ids: MixedMaterailProductListModel[];

}


export class GlobalFilterModel {

  @ApiProperty({ required: false })
  @Type(() => String)
  name_code_filter: string;

}
export class CatalogProductFilterModel {

  @ApiProperty({ required: false })
  @Type(() => String)
  name_code_filter: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  metal_id: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  purity_id: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  catagory_id: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  sizes: string[];

  @ApiProperty({ required: false })
  @Type(() => Number)
  weight_range_from: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  weight_range_to: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  take: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  skip: number;

  @ApiProperty({ required: false })
  @Type(() => Boolean)
  is_stock: boolean;

}


export class ProductFilterListModel {


  @ApiProperty({ required: false })
  @Type(() => String)
  metal_id: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  purity_id: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  category_id: string;

}
