import { ApiProperty } from "@nestjs/swagger"

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