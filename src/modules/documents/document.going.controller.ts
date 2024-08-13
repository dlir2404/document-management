import { BadRequestException, Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurrentUserId, LeaderAuth, OfficeClerkAuth, SpecialistAuth } from "src/shared/decorators";
import { AcceptRequestProcessDto, CompleteProcessGoingDto, DenyRequestProcessDto, RequestProcessDto } from "./dtos/income-document.dto";
import { GoingDocumentService } from "./document.going.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AcceptGoingDocumentDto, GetAllGoingDocumentsRequest } from "./dtos/going-document.dto";

@Controller('/going')
@ApiTags('Going Documents')
export class GoingDocumentController {
  constructor(private readonly goingService: GoingDocumentService) { }
  @Get('/all')
  async getIncomeDocuments(@Query() request: GetAllGoingDocumentsRequest) {
    return this.goingService.getGoingDocuments(request)
  }

  @Post('request-process')
  @LeaderAuth()
  @ApiOperation({ summary: 'Leader request specialist to process the document ' })
  async requestProcess(@Body() body: RequestProcessDto, @CurrentUserId() userId: number) {
    return this.goingService.requestProcess(body, userId)
  }

  @Post('/request-process/accept')
  @ApiOperation({ summary: 'Specialist accept the request process ' })
  @SpecialistAuth()
  async acceptRequestProcess(@Body() body: AcceptRequestProcessDto, @CurrentUserId() userId: number) {
    return this.goingService.acceptRequestProcess(userId, body.documentId)
  }

  @Post('/request-process/deny')
  @ApiOperation({ summary: 'Specialist accept the request process ' })
  @SpecialistAuth()
  async denyRequestProcess(@Body() body: DenyRequestProcessDto, @CurrentUserId() userId: number) {
    return this.goingService.denyRequestProcess(userId, body.documentId, body.returnReason)
  }

  @Post('process/complete')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: "./uploads",
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);

        const newFileName = `${baseName}-@uuid@-${uuidv4()}${ext}`;

        cb(null, newFileName);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== 'application/pdf') {
        return cb(new BadRequestException('Only PDF files are allowed!'), false);
      }
      cb(null, true);
    }
  }))
  @ApiOperation({ summary: 'Specialist complete tase, upload a draft' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File and additional parameters',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        ...CompleteProcessGoingDto
      },
    },
  })
  @SpecialistAuth()
  async completeProcess(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @CurrentUserId() userId: number
  ) {
    return await this.goingService.completeProcess({
      fileName: file?.filename,
      specialistId: userId,
      ...body
    })
  }

  @Post('/document/accept')
  @ApiOperation({ summary: 'Specialist accept the request process ' })
  @LeaderAuth()
  async acceptGoingDocument(@Body() body: AcceptGoingDocumentDto, @CurrentUserId() userId: number) {
    return this.goingService.acceptGoingDocument(userId, body.documentId)
  }

  @Post('/document/publish')
  @ApiOperation({ summary: 'Specialist accept the request process ' })
  @OfficeClerkAuth()
  async publishGoingDocument(@Body() body: AcceptGoingDocumentDto, @CurrentUserId() userId: number) {
    return this.goingService.publishGoingDocument(userId, body.documentId)
  }
}