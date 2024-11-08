
import { ApiProperty } from '@nestjs/swagger';
import { BaseModel } from '../Base.model';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { AttributeDetailEnum } from '@Root/Helper/Enum/InwardTypeEnum';

export class AttributeDetailModel extends BaseModel {

  @IsNotEmpty({ message: "Product Attribute ID required" })
  @ApiProperty({ required: true})
  @Type(() => String)
  attribute_id: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  name: string;

  @ApiProperty({ required: false, enum: AttributeDetailEnum })
  @Type(() => String)
  att_type: AttributeDetailEnum;

  @ApiProperty({ required: false })
  @Type(() => String)
  att_prefix: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  att_value: string;

  @ApiProperty({ required: false })
  @Type(() => String)
  att_suffix: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  display_order: number;

}
