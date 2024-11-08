import { BaseModel } from "@Model/Base.model";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class EmployeeModel extends BaseModel {

    @ApiProperty({ required: false })
    @Type(() => String)
    first_name: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    last_name: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    email: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    mobile_number: string;

    @ApiProperty({ required: false })
    @Type(() => Number)
    display_order: number;

    @ApiProperty({ required: true })
    @Type(() => String)
    password: string;

    @ApiProperty({ required: false })
    @Type(() => String)
    user_role_id: string;
  }
