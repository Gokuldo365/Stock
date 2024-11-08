import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BaseModel } from '@Model/Base.model';

export class ProductImageModel extends BaseModel {

    @ApiProperty({ required: true })
    @Type(() => String)
    product_id: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    uploaded_image: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    file_name: string;

    @ApiProperty({ required: false })
    @Type(() => Number)
    display_order: number;

}

export class ProductImageUpdateModel {

    @ApiProperty({ required: false })
    @Type(() => Number)
    display_order: number;
    
}
