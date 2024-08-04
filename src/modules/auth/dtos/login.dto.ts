import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString } from "class-validator";

export class LoginRequest{
    @ApiProperty({
        type: String
    })
    @IsString()
    @IsDefined()
    username: string

    @ApiProperty({
        type: String
    })
    @IsString()
    @IsDefined()
    password: string
}