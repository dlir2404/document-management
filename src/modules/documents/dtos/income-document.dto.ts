import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsEnum, IsOptional } from "class-validator";
import { IncomeStatus } from "src/database/models";
import { DateNPageDTO } from "src/shared/type";

export const UploadIncomeDocumentRequest = {
    file: {
        type: 'string',
        format: 'binary',
    },
    originalNumber: {
        type: 'string',
    },
    number: {
        type: 'string',
    },
    arrivalDate: {
        type: 'string',
        example: '01/01/2000'
    },
    signDate: {
        type: 'string',
        example: '01/01/2000'
    },
    signer: {
        type: 'string'
    },
    sendFrom: {
        type: 'string'
    },
    sendTo: {
        type: 'string'
    },
    thematic: {
        type: 'string'
    },
    category: {
        type: 'string'
    },
    abstract: {
        type: 'string'
    }
}

export interface IUploadIncomeDocument {
    fileName?: string;
    originalNumber?:string;
    number?:string;
    arrivalDate?:string;
    signDate?:string;
    signer?:string;
    sendFrom?:string;
    sendTo?:string;
    thematic?:string;
    category?:string;
    abstract?:string;
}

export class GetAllIncomeDocumentsRequest extends DateNPageDTO {
    @ApiProperty({
        enum: IncomeStatus,
        isArray: true,
        required: false
    })
    @IsArray()
    @IsOptional()
    @IsEnum(IncomeStatus, { each: true }) // Xác thực rằng mỗi phần tử của mảng là một giá trị trong enum
    status: IncomeStatus[];
}