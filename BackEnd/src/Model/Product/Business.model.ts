import { BaseModel } from "@Model/Base.model";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class BusinessModel extends BaseModel {

    @ApiProperty({ required: true })
    @Type(() => String)
    business_category_id: string;

    @ApiProperty({ required: true })
    @Type(() => String)
    business_name: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    email: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    mobile_no: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    address: string;

    @ApiProperty({ required: false })
    @Type(() => Number)
    display_order: number;

}
