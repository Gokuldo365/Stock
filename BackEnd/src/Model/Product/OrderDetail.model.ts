import { BaseModel } from "@Model/Base.model";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional } from "class-validator";

export class OrderDetailModel extends BaseModel {

    @ApiProperty({ required: false })
    @Type(() => Date)
    order_date: Date;

    @ApiProperty({ required: false })
    @Type(() => String)
    order_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    business_id: string;

    @ApiProperty({ required: false, type: () => [IndividualProductOrderModel] })
    @Type(() => IndividualProductOrderModel)
    Individual_product_list: IndividualProductOrderModel[];

    @ApiProperty({ required: false, type: () => [AttributeProductOrderModel] })
    @Type(() => AttributeProductOrderModel)
    Attribute_product_list: AttributeProductOrderModel[];

}

export class IndividualProductOrderModel {

    @ApiProperty({ required: false })
    @Type(() => String)
    product_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    metal_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    purity_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    category_id: string;

    @ApiProperty({ required: false })
    @Type(() => Number)
    quantity: number;

}

export class AttributeProductOrderModel {

    @ApiProperty({ required: false })
    @Type(() => String)
    product_id: string;

    @ApiProperty({ required: false })
    @Type(() => Number)
    quantity: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => String)
    combination: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => String)
    product_variants_id: string;

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

export class OrderDetailFilterModel {

  @ApiProperty({ required: false })
  @Type(() => Date)
  date_from: Date;

  @ApiProperty({ required: false })
  @Type(() => Date)
  date_to: Date;

  @ApiProperty({ required: false })
  @Type(() => String)
  order_no: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  business_id: string;

}
