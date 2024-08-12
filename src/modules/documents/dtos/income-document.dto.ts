import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { EmergencyLevel, IncomeStatus } from "src/database/models";
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

export const CompleteProcessDto = {
    file: {
        type: 'string',
        format: 'binary',
    },
    documentId: {
        type: 'number',
    },
    abstract: {
        type: 'string',
    }
}

export const CompleteProcessGoingDto = {
    file: {
        type: 'string',
        format: 'binary',
    },
    documentId: {
        type: 'number',
    },
    sendFrom: {
        type: 'string',
    },
    category: {
        type: 'string',
    },
    emergencyLevel: {
        type: 'string',
    },
    thematic: {
        type: 'string',
    },
    abstract: {
        type: 'string'
    }
}

export interface IUploadIncomeDocument {
    fileName?: string;
    originalNumber?: string;
    number?: string;
    arrivalDate?: string;
    signDate?: string;
    signer?: string;
    sendFrom?: string;
    sendTo?: string;
    thematic?: string;
    category?: string;
    abstract?: string;
}

export interface ICompleteProcess {
    documentId?: number;
    fileName?: string;
    specialistId: number,
    abstract?: string;
}

export interface ICompleteProcessGoing {
    documentId?: number;
    fileName?: string;
    specialistId: number,
    sendTo?: string;
    category?: string;
    emergencyLevel?: string;
    thematic?: string;
    abstract?: string;
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

export class PresentToLeaderRequest {
    @ApiProperty({
        type: Number
    })
    leaderId: Number

    @ApiProperty({
        type: Number
    })
    documentId: Number

    @ApiProperty({
        enum: EmergencyLevel
    })
    emergencyLevel: EmergencyLevel
}

export class RequestProcessDto {
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

export class AcceptRequestProcessDto {
    @ApiProperty({
        type: Number
    })
    documentId: number
}

export class DenyRequestProcessDto {
    @ApiProperty({
        type: Number
    })
    documentId: number

    @ApiProperty({
        type: String
    })
    returnReason: string
}

export class AcceptDraftProcessDto {
    @ApiProperty({
        type: Number,
        required: true
    })
    documentId: number
}

export class DenyDraftProcessDto {
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