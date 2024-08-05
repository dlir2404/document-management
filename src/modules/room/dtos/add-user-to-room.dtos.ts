import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDefined } from "class-validator";

export class AddUserToRoomRequest{
    @ApiProperty({
        type: Number
    })
    @IsDefined()
    @Transform(({ value }) => parseInt(value, 10))
    userId: number

    @ApiProperty({
        type: Number
    })
    @IsDefined()
    @Transform(({ value }) => parseInt(value, 10))
    roomId: number
}