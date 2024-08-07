import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurrentUserId, LeaderAuth, SpecialistAuth } from "src/shared/decorators";
import { AcceptRequestProcessDto, DenyRequestProcessDto, RequestProcessDto } from "./dtos/income-document.dto";
import { GoingDocumentService } from "./document.going.service";

@Controller('/going')
@ApiTags('Going Documents')
export class GoingDocumentController {
    constructor(private readonly goingService: GoingDocumentService) {}
    @Post('request-process')
    @LeaderAuth()
    @ApiOperation({ summary: 'Leader request specialist to process the document '})
    async requestProcess(@Body() body: RequestProcessDto, @CurrentUserId() userId: number) {
      return this.goingService.requestProcess(body, userId)
    }
  
    @Post('/request-process/accept')
    @ApiOperation({ summary: 'Specialist accept the request process '})
    @SpecialistAuth()
    async acceptRequestProcess(@Body() body: AcceptRequestProcessDto, @CurrentUserId() userId: number) {
      return this.goingService.acceptRequestProcess(userId, body.documentId)
    }
  
    @Post('/request-process/deny')
    @ApiOperation({ summary: 'Specialist accept the request process '})
    @SpecialistAuth()
    async denyRequestProcess(@Body() body: DenyRequestProcessDto, @CurrentUserId() userId: number) {
      return this.goingService.denyRequestProcess(userId, body.documentId, body.returnReason)
    }
}