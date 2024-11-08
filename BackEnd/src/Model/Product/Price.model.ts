import { BaseModel } from "@Model/Base.model";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class PriceModel extends BaseModel {

    @ApiProperty({ required: false })
    @Type(() => Date)
    date_time: Date;

    @ApiProperty({ required: false })
    @Type(() => String)
    metal_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    purity_id: string;

    @ApiProperty({ required: false })
    @Type(() => Number)
    price: number;

}
