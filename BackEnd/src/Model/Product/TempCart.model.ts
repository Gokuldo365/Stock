
import { ApiProperty } from '@nestjs/swagger';
import { BaseModel } from '../Base.model';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class TempCartModel extends BaseModel {

  @IsNotEmpty({ message: "Product ID required" })
  @ApiProperty({ required: true})
  @Type(() => String)
  product_id: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  product_variants_id: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  combination: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  purity_id: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  category_id: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  stock: number;  

  @IsNotEmpty({ message: "Quantity required" })
  @ApiProperty({ required: false })
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ required: false })
  @Type(() => Boolean)
  is_cart : boolean;
 
}