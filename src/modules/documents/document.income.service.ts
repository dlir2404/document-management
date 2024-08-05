import { Injectable } from "@nestjs/common";
import { IUploadIncomeDocument } from "./dtos/income-document.dto";
import { IncomeDocument } from "src/database/models";

@Injectable()
export class IncomeDocumentService {
    async upload(body: IUploadIncomeDocument) {
        await IncomeDocument.create({
            ...body,
            incomeUrl: body.fileName
        })

        return { result: true }
    }
}