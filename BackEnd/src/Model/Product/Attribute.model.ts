import { ApiProperty } from '@nestjs/swagger';
import { BaseModel } from '../Base.model';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class AttributeModel extends BaseModel {

  @IsNotEmpty({ message: "Product Attribute required" })
  @ApiProperty({ required: true })
  @Type(() => String)
  name: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  display_order: number;

}
