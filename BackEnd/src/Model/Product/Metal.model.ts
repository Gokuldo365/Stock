import { BaseModel } from "@Model/Base.model";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class MetalModel extends BaseModel {

    @ApiProperty({ required: false })
    @Type(() => String)
    name: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    code: string;

    @ApiProperty({ required: false })
    @Type(() => Number)
    display_order: number;

}
