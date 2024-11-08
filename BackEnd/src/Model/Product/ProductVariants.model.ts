
import { ApiProperty } from '@nestjs/swagger';
import { BaseModel } from '../Base.model';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductVariantsModel extends BaseModel {

  @IsNotEmpty({ message: "Product ID required" })
  @ApiProperty({ required: true})
  @Type(() => String)
  product_id: string;

  @ApiProperty({ required: false, type: () => [CombinationList] })
  @Type(() => CombinationList)
  combination: CombinationList[];

  @ApiProperty({ required: false })
  @Type(() => Number)
  display_order: number;

}
export class CombinationList{

  @ApiProperty({ required: false })
  @Type(() => String)
  value: string;

  @IsArray()
  @ApiProperty({ required: false, type: [String] })
  @Type(() => String)
  attribute_ids: any;

  @IsArray()
  @ApiProperty({ required: false, type: [String] })
  @Type(() => String)
  attribute_detail_ids: any;

}

