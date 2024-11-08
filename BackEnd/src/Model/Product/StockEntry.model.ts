import { BaseModel } from "@Model/Base.model";
import { ApiProperty } from "@nestjs/swagger";
import { SaleTypeEnum, StockEntryTypeEnum } from "@Root/Helper/Enum/StockEntryTypeEnum";
import { Type } from "class-transformer";

export class StockEntryModel extends BaseModel {

    @ApiProperty({ required: false, enum: StockEntryTypeEnum })
    @Type(() => String)
    stock_entry_type: StockEntryTypeEnum;

    @ApiProperty({ required: true })
    @Type(() => Date)
    stock_entry_date_time: Date;

    @ApiProperty({ required: false })
    @Type(() => String)
    hand_over_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    received_by_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    metal_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    purity_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    note: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    business_from_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    business_to_id: string;

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

}


export class StockReportModel {

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
    @Type(() => String)
    item_name_code: string;

  }


export class StockLedgerModel {

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
    @Type(() => String)
    product_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    product_variant_id: string;

}


export class BusinessLedgerModel {

    @ApiProperty({ required: false })
    @Type(() => String)
    business_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    metal_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    purity_id: string;

}

export class MetalStockModel {

    @ApiProperty({ required: false })
    @Type(() => String)
    metal_id: string[];

}

export class StockFilterListModel {

  @ApiProperty({ required: false })
  @Type(() => Date)
  date_from: Date;

  @ApiProperty({ required: false })
  @Type(() => Date)
  date_to: Date;

  @ApiProperty({ required: false, enum: StockEntryTypeEnum })
  @Type(() => String)
  stock_entry_type: StockEntryTypeEnum;

  @ApiProperty({ required: false })
  @Type(() => String)
  metal_id: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  purity_id: string;

}
