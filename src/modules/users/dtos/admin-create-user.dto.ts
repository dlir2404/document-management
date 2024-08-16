import { ApiProperty } from "@nestjs/swagger"
import { IsDefined, IsString } from "class-validator"
import { UserRole } from "src/database/models"

export class AdminCreateUserRequest {
    @ApiProperty({
        type: String,
        example: 'specialist'
    })
    @IsString()
    @IsDefined()
    username: string

    @ApiProperty({
        type: String,
        example: 'specialist'
    })
    @IsString()
    @IsDefined()
    password: string

    @ApiProperty({
        enum: UserRole,
        example: '3'
    })
    @IsDefined()
    role: UserRole

    @ApiProperty({
        type: String,
        example: 'VN123'
    })
    @IsString()
    @IsDefined()
    userNumber: string;

    @ApiProperty({
        type: String,
        example: 'Nguyen Van A'
    })
    @IsString()
    @IsDefined()
    fullName: string;

    @ApiProperty({
        type: String,
        example: 'Tien si'
    })
    @IsString()
    @IsDefined()
    title: string;


    @ApiProperty({
        type: String,
        example: 'MALE'
    })
    @IsString()
    @IsDefined()
    gender: string;

    @ApiProperty({
        type: String,
        example: '2024-08-15T20:13:57.738Z'
    })
    @IsString()
    @IsDefined()
    dateOfBirth: string;

    @ApiProperty({
        type: String,
        example: 'Truong Chinh, Dong Da, Ha Noi'

    })
    @IsString()
    @IsDefined()
    address: string;

    @ApiProperty({
        type: String,
        example: '0123456789'
    })
    @IsString()
    @IsDefined()
    phone: string;

    @ApiProperty({
        type: String,
        example: 'example@gmail.com'
    })
    @IsString()
    @IsDefined()
    email: string;
}

export interface IUser {
    username: string;
    password: string;
    role: UserRole;
    userNumber?: string;
    fullName?: string;
    title?: string;
    gender?: string;
    dateOfBirth?: string;
    address?: string;
    phone?: string;
    email?: string;
}