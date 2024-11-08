import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BaseModel } from '@Model/Base.model';

export class PurityModel extends BaseModel {

    @ApiProperty({ required: false, })
    @Type(() => String)
    name: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    code: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    metal_id: string;

    @ApiProperty({ required: false })
    @Type(() => Number)
    display_order: number;

    @ApiProperty({ required: false })
    @Type(() => Number)
    melting: number;


}
