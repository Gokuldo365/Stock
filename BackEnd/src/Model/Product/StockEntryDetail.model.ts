import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BaseModel } from '@Model/Base.model';
import { SaleTypeEnum, StockEntryTypeEnum } from '@Root/Helper/Enum/StockEntryTypeEnum';

export class StockEntryAndDetailModel extends BaseModel {

  @ApiProperty({ required: false, enum: StockEntryTypeEnum })
  @Type(() => String)
  stock_entry_type: StockEntryTypeEnum;

  @ApiProperty({ required: true })
  @Type(() => Date)
  stock_entry_date_time: Date;

  @ApiProperty({ required: false })
  @Type(() => String)
  hand_over_name : string;

  @ApiProperty({ required: false })
  @Type(() => String)
  metal_id: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  purity_id: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  business_id: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  note: string;

  //Rate Cut

  @ApiProperty({ required: false, enum: SaleTypeEnum })
  @Type(() => String)
  sales_type: SaleTypeEnum;

  @ApiProperty({ required: false })
  @Type(() => Number)
  rate_cut_weight: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  gold_rate: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  rate_per_gram: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  item_amount: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  other_amount: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  gross_amount: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  gst: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  gst_amount: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  tcs_tds: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  tcs_tds_amount: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  discount: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  total_amount: number;




  //Deatial
    @ApiProperty({ required: false, })
    @Type(() => String)
    stock_entry_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    product_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    product_variants_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    combination: string;

    @ApiProperty({ required: false })
    @Type(() => Number)
    stock_qty: number;

    @ApiProperty({ required: false, nullable: true })
    @Type(() => Number)
    gross_weight: number;

    @ApiProperty({ required: false, nullable: true })
    @Type(() => Number)
    other_weight: number;

    @ApiProperty({ required: false, nullable: true })
    @Type(() => Number)
    net_weight: number;

    @ApiProperty({ required: false, nullable: true })
    @Type(() => Number)
    other_charges: number;

    @ApiProperty({ required: false, nullable: true })
    @Type(() => Number)
    melting: number;

    @ApiProperty({ required: false, nullable: true })
    @Type(() => Number)
    pure_weight: number;

    @ApiProperty({ required: false, nullable: true })
    @Type(() => Number)
    wastage: number;

    @ApiProperty({ required: false, nullable: true })
    @Type(() => Number)
    fine_weight: number;

    @ApiProperty({ required: false, nullable: true })
    @Type(() => Number)
    mc_amount: number;

    @ApiProperty({ required: false, nullable: true })
    @Type(() => Number)
    lab_rate: number;

    @ApiProperty({ required: false, nullable: true })
    @Type(() => Number)
    amount: number;

    @ApiProperty({ required: false, type: () => [StockMixedMaterialModel] })
    @Type(() => StockMixedMaterialModel)
    mixed_material: StockMixedMaterialModel[];

}


export class StockMixedMaterialModel{

  @ApiProperty({ required: false, nullable: true })
  @Type(() => String)
  mixed_material_id: string;

  @ApiProperty({ required: false, nullable: true })
  @Type(() => Number)
  weight: number;

  @ApiProperty({ required: false, nullable: true })
  @Type(() => Number)
  amount: number;

}


export class StockEntryDetailModel{

  @ApiProperty({ required: false, })
  @Type(() => String)
  stock_entry_id: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  product_id: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  product_variants_id: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  combination: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  stock_qty: number;

  @ApiProperty({ required: false, nullable: true })
  @Type(() => Number)
  gross_weight: number;

  @ApiProperty({ required: false, nullable: true })
  @Type(() => Number)
  other_weight: number;

  @ApiProperty({ required: false, nullable: true })
  @Type(() => Number)
  net_weight: number;

  @ApiProperty({ required: false, nullable: true })
  @Type(() => Number)
  other_charges: number;

  @ApiProperty({ required: false, nullable: true })
  @Type(() => Number)
  melting: number;

  @ApiProperty({ required: false, nullable: true })
  @Type(() => Number)
  pure_weight: number;

  @ApiProperty({ required: false, nullable: true })
  @Type(() => Number)
  wastage: number;

  @ApiProperty({ required: false, nullable: true })
  @Type(() => Number)
  fine_weight: number;

  @ApiProperty({ required: false, nullable: true })
  @Type(() => Number)
  mc_amount: number;

  @ApiProperty({ required: false })
  @Type(() => String)
  history_note: string;

  @ApiProperty({ required: false, nullable: true })
  @Type(() => Number)
  lab_rate: number;

  @ApiProperty({ required: false, nullable: true })
  @Type(() => Number)
  amount: number;

  @ApiProperty({ required: false, type: () => [StockMixedMaterialModel] })
  @Type(() => StockMixedMaterialModel)
  mixed_material: StockMixedMaterialModel[];

}


export class RateCutCalculationModel{

  //Rete Cut

  @ApiProperty({ required: false, enum: SaleTypeEnum })
  @Type(() => String)
  sales_type: SaleTypeEnum;

  @ApiProperty({ required: false })
  @Type(() => String)
  stock_entry_id: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  rate_cut_weight: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  gold_rate: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  rate_per_gram: number;

  // @ApiProperty({ required: false })
  // @Type(() => Number)
  // item_amount: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  other_amount: number;

  // @ApiProperty({ required: false })
  // @Type(() => Number)
  // gross_amount: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  gst: number;

  // @ApiProperty({ required: false })
  // @Type(() => Number)
  // gst_amount: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  tcs_tds: number;

  // @ApiProperty({ required: false })
  // @Type(() => Number)
  // tcs_tds_amount: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  discount: number;

  // @ApiProperty({ required: false })
  // @Type(() => Number)
  // total_amount: number;

}
