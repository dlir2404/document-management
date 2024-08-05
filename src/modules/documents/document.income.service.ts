import { Injectable } from "@nestjs/common";
import { GetAllIncomeDocumentsRequest, IUploadIncomeDocument } from "./dtos/income-document.dto";
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

    async getIncomeDocuments(params: GetAllIncomeDocumentsRequest) {
        
        const { rows, count } = await IncomeDocument.findAndCountAll({
            limit: +params.pageSize,
            offset: (params.page - 1) * +params.pageSize
        })

        return { rows, count }
    }
}