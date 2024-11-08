import { BaseModel } from "@Model/Base.model";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class UnitOfMeasurementModel extends BaseModel {

    @ApiProperty({ required: true })
    @Type(() => String)
    name: string;

    @ApiProperty({ required: true })
    @Type(() => String)
    code: string;

    @ApiProperty({ required: true })
    @Type(() => String)
    quantity: string;

    @ApiProperty({ required: true })
    @Type(() => Number)
    display_order: number;
}
