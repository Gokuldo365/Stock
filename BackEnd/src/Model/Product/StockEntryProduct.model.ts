import { BaseModel } from "@Model/Base.model";
import { ApiProperty } from "@nestjs/swagger";
import { StockEntryTypeEnum } from "@Root/Helper/Enum/StockEntryTypeEnum";
import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class StockEntryProductModel extends BaseModel {

    @IsNotEmpty({ message: 'Metal required' })
    @ApiProperty({ required: true })
    @Type(() => String)
    metal_id: string;

    @IsNotEmpty({ message: 'Purity required' })
    @ApiProperty({ required: true })
    @Type(() => String)
    purity_id: string;
}
