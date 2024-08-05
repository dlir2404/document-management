import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString } from "class-validator";

export class CreateRoomRequest{
    @ApiProperty({
        type: String
    })
    @IsString()
    @IsDefined()
    name: string
}