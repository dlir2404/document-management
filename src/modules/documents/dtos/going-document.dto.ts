import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { GoingStatus } from "src/database/models";
import { DateNPageDTO } from "src/shared/type";

export class AcceptGoingDocumentDto {
    @ApiProperty({
        type: Number
    })
    documentId: number
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
}