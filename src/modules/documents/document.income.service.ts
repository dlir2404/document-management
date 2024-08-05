import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { GetAllIncomeDocumentsRequest, IUploadIncomeDocument, PresentToLeaderRequest } from "./dtos/income-document.dto";
import { IncomeDocument, IncomeStatus, User, UserRole } from "src/database/models";
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

    async presentToLeader(body: PresentToLeaderRequest) {
        const leader = await User.findOne({
            where: {
                id: body.leaderId,
                role: UserRole.LEADER
            }
        })

        if (!leader) {
            throw new NotFoundException('Leader not found')
        }

        const document = await IncomeDocument.findOne({
            where: {
                id: body.documentId
            }
        })

        if (!document) {
            throw new NotFoundException('Document not found')
        }

        if (document.status !== IncomeStatus.WAITING_FOR_PRESENTING_TO_LEADER) {
            throw new BadRequestException('Document status is not ' + IncomeStatus.WAITING_FOR_PRESENTING_TO_LEADER)
        }

        document.leaderId = leader.id
        document.emergencyLevel = body.emergencyLevel
        document.status = IncomeStatus.PRESENTED_TO_LEADER

        await document.save()

        return { result: true }
    }
}