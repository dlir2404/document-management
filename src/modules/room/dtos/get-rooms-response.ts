import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class RoomResponse{
    @ApiProperty({
        type: Number,
    })
    @Expose()
    id: number;

    @ApiProperty({
        type: String,
    })
    @Expose()
    name: string
}