import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { IncomeDocumentService } from "./document.income.service";
import { AcceptRequestProcessDto, DenyRequestProcessDto, GetAllIncomeDocumentsRequest, PresentToLeaderRequest, RequestProcessDto, UploadIncomeDocumentRequest } from "./dtos/income-document.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { CurrentUserId, LeaderAuth, SpecialistAuth } from "src/shared/decorators";

@Controller('/income')
@ApiTags('Income Documents')
export class IncomeDocumentController {
  constructor(private incomeService: IncomeDocumentService) { }

  @Post('upload')
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
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File and additional parameters',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        ...UploadIncomeDocumentRequest
      },
    },
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {
    return await this.incomeService.upload({
      fileName: file?.filename,
      ...body
    })
  }

  @Get('/all')
  async getIncomeDocuments(@Query() request: GetAllIncomeDocumentsRequest) {
    return this.incomeService.getIncomeDocuments(request)
  }

  @Post('/present-to-leader')
  @ApiOperation({ summary: 'Office clerk present document to leader'})
  async presentToLeader(@Body() body: PresentToLeaderRequest) {
    return await this.incomeService.presentToLeader(body)
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: number) {
    return this.incomeService.deleteDocument(id)
  }

  @Post('request-process')
  @LeaderAuth()
  @ApiOperation({ summary: 'Leader request specialist to process the document '})
  async requestProcess(@Body() body: RequestProcessDto, @CurrentUserId() userId: number) {
    return this.incomeService.requestProcess(body, userId)
  }

  @Post('/request-process/accept')
  @ApiOperation({ summary: 'Specialist accept the request process '})
  @SpecialistAuth()
  async acceptRequestProcess(@Body() body: AcceptRequestProcessDto, @CurrentUserId() userId: number) {
    return this.incomeService.acceptRequestProcess(userId, body.documentId)
  }

  @Post('/request-process/deny')
  @ApiOperation({ summary: 'Specialist accept the request process '})
  @SpecialistAuth()
  async denyRequestProcess(@Body() body: DenyRequestProcessDto, @CurrentUserId() userId: number) {
    return this.incomeService.denyRequestProcess(userId, body.documentId, body.returnReason)
  }
}