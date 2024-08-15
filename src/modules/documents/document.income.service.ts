import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { DenyDraftProcessDto, GetAllIncomeDocumentsRequest, ICompleteProcess, ISearch, IUploadIncomeDocument, PresentToLeaderRequest, RequestProcessDto } from "./dtos/income-document.dto";
import { CommandDraftTicket, CommandTicket, GoingDocument, IncomeDocument, IncomeStatus, TicketStatus, User, UserRole } from "src/database/models";
import { Op, Sequelize, where, WhereOptions } from "sequelize";

@Injectable()
export class IncomeDocumentService {
    async upload(body: IUploadIncomeDocument) {
        await IncomeDocument.create({
            ...body,
            incomeUrl: body.fileName
        })

        return { result: true }
    }

    async searchDocument({ query, page, pageSize }: ISearch) {
        let where: WhereOptions<IncomeDocument> = {}

        if (query) {
            where = {
                [Op.or]: [
                    { originalNumber: { [Op.like]: `%${query}%` } },
                    { number: { [Op.like]: `%${query}%` } },
                    { signer: { [Op.like]: `%${query}%` } },
                    { sendFrom: { [Op.like]: `%${query}%` } },
                    { sendTo: { [Op.like]: `%${query}%` } },
                    { thematic: { [Op.like]: `%${query}%` } },
                    { category: { [Op.like]: `%${query}%` } },
                    { abstract: { [Op.like]: `%${query}%` } },
                ]
            };
        }

        const { rows, count } = await IncomeDocument.findAndCountAll({
            include: ['leader', 'mainProcessor'],
            order: [['id', 'DESC']],
            limit: +pageSize,
            offset: (page - 1) * +pageSize,
            where: where
        })

        return {
            rows,
            count
        }
    }

    async getIncomeDocumentTicket(documentId: number) {
        const document = await IncomeDocument.findOne({
            where: {
                id: documentId
            }
        })

        const draftTicket = await CommandDraftTicket.findOne({
            where: {
                incomeDocumentId: documentId
            }
        })

        if (draftTicket) {
            return {
                draftTicket: draftTicket
            }
        }

        const commandTicket = await CommandTicket.findOne({
            where: {
                incomeDocumentId: documentId
            }
        })

        return {
            commandTicket: commandTicket
        }
    }

    async getIncomeDocuments(params: GetAllIncomeDocumentsRequest) {

        let where: WhereOptions<IncomeDocument> = {}

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

        if (params.query) {
            where = {
                ...where,
                [Op.or]: [
                    { originalNumber: { [Op.like]: `%${params.query}%` } },
                    { number: { [Op.like]: `%${params.query}%` } },
                    { signer: { [Op.like]: `%${params.query}%` } },
                    { sendFrom: { [Op.like]: `%${params.query}%` } },
                    { sendTo: { [Op.like]: `%${params.query}%` } },
                    { thematic: { [Op.like]: `%${params.query}%` } },
                    { category: { [Op.like]: `%${params.query}%` } },
                    { abstract: { [Op.like]: `%${params.query}%` } },
                ]

            }
        }

        const { rows, count } = await IncomeDocument.findAndCountAll({
            include: ['leader', 'mainProcessor', 'collaborators'],
            order: [['id', 'DESC']],
            limit: +params.pageSize,
            offset: (params.page - 1) * +params.pageSize,
            where: where
        })

        return { rows, count }
    }

    async presentToLeader(body: PresentToLeaderRequest, officeClerkId: number) {
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

    async deleteDocument(id: number) {
        const document = await IncomeDocument.findByPk(id)

        if (!document) {
            throw new NotFoundException("Document not found")
        }

        await IncomeDocument.destroy({
            where: {
                id: id
            }
        })

        return { result: true }
    }

    async requestProcess(body: RequestProcessDto, leaderId: number) {
        const incomeDocument = await IncomeDocument.findOne({
            where: {
                id: body.documentId
            }
        })

        if (!incomeDocument) throw new NotFoundException("Document not found")

        if (incomeDocument.leaderId != leaderId) throw new ForbiddenException('You are not in charge of this document')

        const mainProcessor = await User.findOne({
            where: {
                id: body.specialistId,
                role: UserRole.SPECIALIST
            }
        })

        if (!mainProcessor) {
            throw new NotFoundException('Main processor not found')
        }

        await CommandTicket.create({
            incomeDocumentId: body.documentId,
            mainProcessorId: body.specialistId,
            deadline: body.deadline,
            processDirection: body.processDirection,
        })

        await IncomeDocument.update(
            {
                status: IncomeStatus.ASSIGNED_FOR_PROCESS,
                mainProcessorId: body.specialistId,
                deadline: body.deadline,
            },
            {
                where: { id: body.documentId },
            }
        );

        if (body.collaborators && body.collaborators.length > 0) {
            await incomeDocument.$set('collaborators', body.collaborators)
        }

        return { result: true }
    }

    async acceptRequestProcess(specialistId: number, documentId: number) {
        const specialist = await User.findOne({
            where: {
                id: specialistId,
                role: UserRole.SPECIALIST
            }
        })

        if (!specialist) throw new NotFoundException('Specialist not found')

        const document = await IncomeDocument.findOne({
            where: {
                id: documentId,
                status: IncomeStatus.ASSIGNED_FOR_PROCESS
            }
        })

        if (!document) throw new NotFoundException('Document not found or document status not correct')

        const commandTicket = await CommandTicket.findOne({
            where: {
                incomeDocumentId: documentId,
                mainProcessorId: specialistId,
                status: TicketStatus.WAITING
            }
        })

        if (!commandTicket) throw new NotFoundException('Ticket not found')

        await document.update(
            {
                status: IncomeStatus.PROCESSING,
                mainProcessorId: specialistId
            }
        )

        await CommandTicket.update({
            status: TicketStatus.ACCEPTED
        }, { where: { id: commandTicket.id } })

        return { result: true }
    }

    async denyRequestProcess(specialistId: number, documentId: number, returnReason: string) {
        const specialist = await User.findOne({
            where: {
                id: specialistId,
                role: UserRole.SPECIALIST
            }
        })

        if (!specialist) throw new NotFoundException('Specialist not found')

        const document = await IncomeDocument.findOne({
            where: {
                id: documentId,
                status: IncomeStatus.ASSIGNED_FOR_PROCESS
            }
        })

        if (!document) throw new NotFoundException('Document not found or document status not correct')

        const commandTicket = await CommandTicket.findOne({
            where: {
                incomeDocumentId: documentId,
                mainProcessorId: specialistId,
                status: TicketStatus.WAITING
            }
        })

        if (!commandTicket) throw new NotFoundException('Ticket not found')

        await document.update(
            {
                status: IncomeStatus.PRESENTED_TO_LEADER,
            }
        )

        await CommandTicket.update({
            status: TicketStatus.REFUSED,
            returnReason: returnReason
        }, { where: { id: commandTicket.id } })

        return { result: true }
    }

    async completeProcess(body: ICompleteProcess) {
        const specialist = await User.findOne({
            where: {
                id: body.specialistId
            }
        })

        const document = await IncomeDocument.findOne({
            where: {
                id: body.documentId,
                status: IncomeStatus.PROCESSING
            }
        })

        if (!document) throw new NotFoundException('Document not found')

        if (document.mainProcessorId !== body.specialistId) throw new BadRequestException('You are not in charge of this document')

        await IncomeDocument.update(
            {
                status: IncomeStatus.WAITING_FOR_APPROVING_DRAFT,
                draftUrl: body.fileName,
                abstractDraft: body.abstractDraft
            },
            {
                where: {
                    id: body.documentId
                }
            }
        )

        return { result: true }
    }

    async acceptDraftProcess(leaderId: number, documentId: number) {
        const document = await IncomeDocument.findOne({
            where: {
                id: documentId
            },
            include: ['mainProcessor']
        })

        if (!document) throw new NotFoundException('Document not found')

        if (document.leaderId !== leaderId) throw new ForbiddenException('You are not in charge of this document')

        if (document.status !== IncomeStatus.WAITING_FOR_APPROVING_DRAFT) throw new BadRequestException('Status of document is not waiting for approving draft')

        await IncomeDocument.update(
            {
                status: IncomeStatus.APPROVED_DRAFT
            },
            {
                where: {
                    id: documentId
                }
            }
        )


        //dang lam toi day
        await GoingDocument.create({
            abstractDraft: document.abstractDraft,
            draftUrl: document.draftUrl,
            sendFrom: document.mainProcessor.room?.name || null,
            leaderId: document.leaderId
        })

        return { result: true }
    }

    async denyDraftProcess(leaderId: number, body: DenyDraftProcessDto) {
        const document = await IncomeDocument.findOne({
            where: {
                id: body.documentId
            }
        })

        if (!document) throw new NotFoundException('Document not found')

        if (document.leaderId !== leaderId) throw new ForbiddenException('You are not in charge of this document')

        if (document.status !== IncomeStatus.WAITING_FOR_APPROVING_DRAFT) throw new BadRequestException('Status of document is not waiting for approving draft')

        //cho nay
        const mainProcessor = await User.findOne({
            where: {
                id: body.specialistId,
                role: UserRole.SPECIALIST
            }
        })

        if (!mainProcessor) {
            throw new NotFoundException('Main processor not found')
        }

        await CommandDraftTicket.create({
            incomeDocumentId: body.documentId,
            mainProcessorId: body.specialistId,
            deadline: body.deadline,
            processDirection: body.processDirection,
        })

        await IncomeDocument.update(
            {
                status: IncomeStatus.ASSIGNED_FOR_PROCESS,
                mainProcessorId: body.specialistId,
            },
            {
                where: { id: body.documentId },
            }
        );

        if (body.collaborators && body.collaborators.length > 0) {
            await document.$set('collaborators', body.collaborators)
        }

        return { result: true }
    }
}