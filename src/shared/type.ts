import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class BaseResponse{
    @ApiProperty({
        type: Boolean
    })
    result: boolean
}

export class PaginationDTO {
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => parseInt(value))
  @ApiProperty({
    example: 1,
    name: 'page',
    type: Number,
  })
  page = 1;

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => parseInt(value))
  @ApiProperty({
    example: 10,
    name: 'pageSize',
    type: Number,
  })
  pageSize = 10;
}

export class FromToDateDTO {
  @ApiProperty({
    example: '2023-07-10',
    description: 'Từ ngày',
    required: false,
  })
  @IsOptional()
  @IsString()
  from: string;

  @ApiProperty({
    example: '2023-07-20',
    description: 'Đến ngày',
    required: false,
  })
  @IsOptional()
  @IsString()
  to: string;
}

export class DateNPageDTO {
  @IsOptional()
  @ApiProperty({
    example: 1,
    name: 'page',
    type: Number,
  })
  @Transform(({ value }: TransformFnParams) => parseInt(value))
  page = 1;

  @IsOptional()
  @ApiProperty({
    example: 10,
    name: 'pageSize',
    type: Number,
  })
  @Transform(({ value }: TransformFnParams) => parseInt(value))
  pageSize: number;

  @ApiProperty({
    example: '2023-07-10',
    description: 'Từ ngày',
    required: false,
  })
  @IsOptional()
  @IsString()
  from: string;

  @ApiProperty({
    example: '2023-07-20',
    description: 'Đến ngày',
    required: false,
  })
  @IsOptional()
  @IsString()
  to: string;
}
