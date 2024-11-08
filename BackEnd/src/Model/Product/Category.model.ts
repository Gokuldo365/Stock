import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BaseModel } from '@Model/Base.model';

export class CategoryModel extends BaseModel {

    @ApiProperty({ required: false })
    @Type(() => String)
    name: string;

    @ApiProperty({ required: true })
    @Type(() => String)
    metal_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    code: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    parent_category_id : string;

    @ApiProperty({ required: false })
    @Type(() => Boolean)
    is_stock_category : boolean;

    @ApiProperty({ required: false })
    @Type(() => Number)
    display_order: number;

}
