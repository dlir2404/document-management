import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ICompleteProcessGoing, ISearch, RequestProcessDto } from "./dtos/income-document.dto";
import { GoingDocument, GoingStatus, ProcessEditTicket, ProcessTicket, Room, TicketStatus, User, UserRole } from "src/database/models";
import { Op, where, WhereOptions } from "sequelize";
import { AcceptGoingDocumentDto, DenyDocumentProcessDto, GetAllGoingDocumentsRequest } from "./dtos/going-document.dto";

@Injectable()
export class GoingDocumentService {

    async getGoingDocuments(params: GetAllGoingDocumentsRequest) {

        let where: WhereOptions<GoingDocument> = {}

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
                    { number: { [Op.like]: `%${params.query}%` } },
                    { signer: { [Op.like]: `%${params.query}%` } },
                    { sendFrom: { [Op.like]: `%${params.query}%` } },
                    { sendTo: { [Op.like]: `%${params.query}%` } },
                    { thematic: { [Op.like]: `%${params.query}%` } },
                    { category: { [Op.like]: `%${params.query}%` } },
                    { abstract: { [Op.like]: `%${params.query}%` } },
                    { abstractDraft: { [Op.like]: `%${params.query}%` } },
                ]

            }
        }

        const { rows, count } = await GoingDocument.findAndCountAll({
            include: ['leader', 'mainProcessor', 'collaborators'],
            order: [['id', 'DESC']],
            limit: +params.pageSize,
            offset: (params.page - 1) * +params.pageSize,
            where: where
        })

        return { rows, count }
    }

    async searchDocument({ query, page, pageSize }: ISearch) {
        let where: WhereOptions<GoingDocument> = {}

        if (query) {
            where = {
                [Op.or]: [
                    { number: { [Op.like]: `%${query}%` } },
                    { signer: { [Op.like]: `%${query}%` } },
                    { sendFrom: { [Op.like]: `%${query}%` } },
                    { sendTo: { [Op.like]: `%${query}%` } },
                    { thematic: { [Op.like]: `%${query}%` } },
                    { category: { [Op.like]: `%${query}%` } },
                    { abstract: { [Op.like]: `%${query}%` } },
                    { abstractDraft: { [Op.like]: `%${query}%` } },
                ]
            };
        }

        const { rows, count } = await GoingDocument.findAndCountAll({
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

    async requestProcess(body: RequestProcessDto, leaderId: number) {
        const goingDocument = await GoingDocument.findOne({
            where: {
                id: body.documentId
            }
        })

        if (!goingDocument) throw new NotFoundException("Document not found")

        if (goingDocument.leaderId != leaderId) throw new ForbiddenException('You are not in charge of this document')

        const mainProcessor = await User.findOne({
            where: {
                id: body.specialistId,
                role: UserRole.SPECIALIST
            }
        })

        if (!mainProcessor) {
            throw new NotFoundException('Main processor not found')
        }

        await ProcessTicket.create({
            goingDocumentId: goingDocument.id,
            mainProcessorId: body.specialistId,
            deadline: body.deadline,
            processDirection: body.processDirection,
        })

        await GoingDocument.update(
            {
                status: GoingStatus.ASSIGNMENT_FOR_PROCESS,
                deadline: body.deadline,
            },
            {
                where: { id: body.documentId },
            }
        );

        if (body.collaborators && body.collaborators.length > 0) {
            await goingDocument.$set('collaborators', body.collaborators)
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

        const document = await GoingDocument.findOne({
            where: {
                id: documentId,
                status: GoingStatus.ASSIGNMENT_FOR_PROCESS,
            }
        })

        if (!document) throw new NotFoundException('Document not found or document status not correct')

        const processTicket = await ProcessTicket.findOne({
            where: {
                goingDocumentId: documentId,
                mainProcessorId: specialistId,
                status: TicketStatus.WAITING
            }
        })

        if (!processTicket) throw new NotFoundException('Ticket not found')

        await document.update(
            {
                status: GoingStatus.PROCESSING,
                mainProcessorId: specialistId
            }
        )

        await ProcessTicket.update({
            status: TicketStatus.ACCEPTED
        }, { where: { id: processTicket.id } })

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

        const document = await GoingDocument.findOne({
            where: {
                id: documentId,
                status: GoingStatus.ASSIGNMENT_FOR_PROCESS
            }
        })

        if (!document) throw new NotFoundException('Document not found or document status not correct')

        const processTicket = await ProcessTicket.findOne({
            where: {
                goingDocumentId: documentId,
                mainProcessorId: specialistId,
                status: TicketStatus.WAITING
            }
        })

        if (!processTicket) throw new NotFoundException('Ticket not found')

        await document.update(
            {
                status: GoingStatus.WAITING_FOR_ASSIGNMENT,
            }
        )

        await ProcessTicket.update({
            status: TicketStatus.REFUSED,
            returnReason: returnReason
        }, { where: { id: processTicket.id } })

        return { result: true }
    }

    async completeProcess(body: ICompleteProcessGoing) {
        const specialist = await User.findOne({
            where: {
                id: body.specialistId
            }
        })

        const document = await GoingDocument.findOne({
            where: {
                id: body.documentId,
                status: GoingStatus.PROCESSING
            }
        })

        if (!document) throw new NotFoundException('Document not found')

        if (document.mainProcessorId !== body.specialistId) throw new BadRequestException('You are not in charge of this document')

        await GoingDocument.update(
            {
                status: GoingStatus.WAITING_FOR_APPROVE,
                goingUrl: body.fileName,
                sendTo: body.sendTo,
                sendFrom: specialist.room?.name || null,
                category: body.category,
                emergencyLevel: body.emergencyLevel,
                thematic: body.thematic,
                abstract: body.abstract,
            },
            {
                where: {
                    id: body.documentId
                }
            }
        )

        return { result: true }
    }

    async acceptGoingDocument(leaderId: number, documentId: number) {
        const document = await GoingDocument.findOne({
            where: {
                id: documentId
            }
        })

        if (!document) throw new NotFoundException('Document not found')

        if (leaderId !== document.leaderId) throw new ForbiddenException('You are not in charge of this document')

        const leader = await User.findOne({
            where: {
                id: leaderId,
                role: UserRole.LEADER
            }
        })

        if (!leader) throw new NotFoundException('Leader not found')

        await document.update({
            status: GoingStatus.APPROVED,
            signer: leader.username,
            signDate: (new Date()).toISOString()
        })

        return { result: true }
    }

    async denyDocumentProcess(leaderId: number, body: DenyDocumentProcessDto) {
        const document = await GoingDocument.findOne({
            where: {
                id: body.documentId
            }
        })

        if (!document) throw new NotFoundException('Document not found')

        if (document.leaderId !== leaderId) throw new ForbiddenException('You are not in charge of this document')

        if (document.status !== GoingStatus.WAITING_FOR_APPROVE) throw new BadRequestException('Status of document is not waiting for approve')

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

        await ProcessEditTicket.create({
            goingDocumentId: body.documentId,
            mainProcessorId: body.specialistId,
            deadline: body.deadline,
            processDirection: body.processDirection,
        })

        await GoingDocument.update(
            {
                status: GoingStatus.ASSIGNMENT_FOR_PROCESS,
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

    async publishGoingDocument(officeClerkId: number, body: AcceptGoingDocumentDto) {
        const document = await GoingDocument.findOne({
            include: ['mainProcessor'],
            where: {
                id: body.documentId
            }
        })

        if (!document) throw new NotFoundException('Document not found')

        const room = await Room.findOne({
            where: {
                id: document.mainProcessor.roomId
            }
        })

        await document.update({
            status: GoingStatus.PUBLISHED,
            number: body.number,
            sendFrom: room?.name || null
        })

        return { result: true }
    }

    async getLastTicket(type: string) {
        if (type === 'process') {
            return ProcessTicket.findOne({
                order: [['id', 'desc']]
            })
        }

        if (type === 'process-edit') {
            return ProcessEditTicket.findOne({
                order: [['id', 'desc']]
            })
        }

        throw new BadRequestException('Invalid ticket type')
    }
}