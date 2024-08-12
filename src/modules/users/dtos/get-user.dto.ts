import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsOptional } from "class-validator";

export class GetUserByRole {
    @IsOptional()
    @ApiProperty({
      example: 1,
      type: Number,
      required: false
    })
    @Transform(({ value }: TransformFnParams) => parseInt(value))
    roomId?: number;

    @ApiProperty({
        type: String
    })
    role: string;
}