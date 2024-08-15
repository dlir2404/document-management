import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { GoingStatus } from "src/database/models";
import { DateNPageDTO } from "src/shared/type";

export class AcceptGoingDocumentDto {
    @ApiProperty({
        type: Number
    })
    documentId: number

    @ApiProperty({
        type: String
    })
    number: string
}

export class GetAllGoingDocumentsRequest extends DateNPageDTO {
    @ApiProperty({
        enum: GoingStatus,
        isArray: true,
        required: false
    })
    @IsArray()
    @IsOptional()
    @IsEnum(GoingStatus, { each: true }) // Xác thực rằng mỗi phần tử của mảng là một giá trị trong enum
    status: GoingStatus[];

    @ApiProperty({
        type: String,
        required: false
    })
    @IsString()
    query: string;
}

export class GetGoingDocumentTicketRequest {
    @ApiProperty({
        type: Number,
        required: true
    })
    id: number;
}


export class DenyDocumentProcessDto {
    @ApiProperty({
        type: Number
    })
    documentId: Number

    @ApiProperty({
        type: Number
    })
    specialistId: Number

    @ApiProperty({
        type: Number,
        isArray: true,
        required: false
    })
    @IsArray()
    @IsOptional()
    @IsNumber({}, { each: true })
    collaborators: number[];

    @ApiProperty({
        type: String
    })
    processDirection: string

    @ApiProperty({
        example: '2023-07-10',
        description: 'Từ ngày',
        required: false,
    })
    @IsOptional()
    @IsString()
    deadline: string;
}