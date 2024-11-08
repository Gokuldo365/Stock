import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BaseModel } from '@Model/Base.model';
import { StockEntryTypeEnum } from '@Root/Helper/Enum/StockEntryTypeEnum';

export class StockEntryHistoryModel extends BaseModel {

    @ApiProperty({ required: false, })
    @Type(() => String)
    stock_entry_detail_id: string;

    @ApiProperty({ required: false })
    @Type(() => Date)
    modified_date: Date;

    @ApiProperty({ required: false })
    @Type(() => String)
    modified_by: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    notes: string;
}
