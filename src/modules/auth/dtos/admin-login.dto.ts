import { ApiProperty } from "@nestjs/swagger"
import { Exclude, Expose } from "class-transformer"
import { IsDefined, IsString } from "class-validator"

export class AdminLoginRequest{
    @ApiProperty({
        type: String,
        example: 'admin'
    })
    @IsString()
    @IsDefined()
    username: string

    @ApiProperty({
        type: String,
        example: 'admin'
    })
    @IsString()
    @IsDefined()
    password: string
}

@Exclude()
export class AdminLoginResponse{
    @Expose()
    @ApiProperty({
        type: String,
    })
    token: string
}
