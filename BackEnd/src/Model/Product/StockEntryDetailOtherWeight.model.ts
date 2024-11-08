import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BaseModel } from '@Model/Base.model';
import { StockEntryTypeEnum } from '@Root/Helper/Enum/StockEntryTypeEnum';

export class StockEntryDetailOtherWeightModel extends BaseModel {

    @ApiProperty({ required: false, })
    @Type(() => String)
    stock_entry_detail_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    product_mixed_material_id: string;

    @ApiProperty({ required: false, enum: StockEntryTypeEnum })
    @Type(() => String)
    stock_entry_type: StockEntryTypeEnum;

    @ApiProperty({ required: false })
    @Type(() => Number)
    weight: number;

    @ApiProperty({ required: false })
    @Type(() => Number)
    amount: number;

}
