import { Injectable } from "@nestjs/common";
import { GetAllIncomeDocumentsRequest, IUploadIncomeDocument } from "./dtos/income-document.dto";
import { IncomeDocument } from "src/database/models";
import { Op, where, WhereOptions } from "sequelize";

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

        let where:  WhereOptions<IncomeDocument> = {}

        if (params.status) {
            if (Array.isArray(params.status)) {
                where = {
                    ...where,
                    status: {
                        [Op.in]: params.status
                    }
                }
            } else {
                where = {
                    ...where,
                    status: params.status
                }
            }
        }
        
        const { rows, count } = await IncomeDocument.findAndCountAll({
            limit: +params.pageSize,
            offset: (params.page - 1) * +params.pageSize,
            where: where
        })

        return { rows, count }
    }
}