import { ApiProperty } from "@nestjs/swagger";

export class BaseResponse{
    @ApiProperty({
        type: Boolean
    })
    result: boolean
}