import { BaseModel } from "@Model/Base.model";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class MixedMaterialModel extends BaseModel {

    @ApiProperty({ required: false })
    @Type(() => String)
    name: string;

    @ApiProperty({ required: false })
    @Type(() => Number)
    weight: number;

    @ApiProperty({ required: false })
    @Type(() => Number)
    karat: number;

    @ApiProperty({ required: false })
    @Type(() => Number)
    cent: number;

    @ApiProperty({ required: false })
    @Type(() => Number)
    display_order: number;

}
