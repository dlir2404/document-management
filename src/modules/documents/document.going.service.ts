import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ICompleteProcessGoing, RequestProcessDto } from "./dtos/income-document.dto";
import { GoingDocument, GoingStatus, ProcessTicket, TicketStatus, User, UserRole } from "src/database/models";

@Injectable()
export class GoingDocumentService {
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
            goingDocumentId: body.documentId,
            mainProcessorId: body.specialistId,
            deadline: body.deadline,
            processDirection: body.processDirection,
        })

        await GoingDocument.update(
            {
                status: GoingStatus.ASSIGNMENT_FOR_PROCESS,
            },
            {
                where: { id: body.documentId },
            }
        );

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
        }, { where: { id: processTicket.id }})

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
        }, { where: { id: processTicket.id }})

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
}