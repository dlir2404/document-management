import { ApiProperty } from "@nestjs/swagger";

export class AcceptGoingDocumentDto {
    @ApiProperty({
        type: Number
    })
    documentId: number
}