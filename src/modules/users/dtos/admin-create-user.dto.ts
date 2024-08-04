import { ApiProperty } from "@nestjs/swagger"
import { IsDefined, IsString } from "class-validator"
import { User, UserRole } from "src/database/models"

export class AdminCreateUserRequest{
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

    @ApiProperty({
        enum: UserRole,
    })
    @IsDefined()
    role: UserRole
}