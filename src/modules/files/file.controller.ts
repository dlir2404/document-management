import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { diskStorage } from 'multer'

@Controller('file')
@ApiTags('File')
export class FileController{

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: "./uploads",
            filename: (req, file, cb) => {
                cb(null, `${file.originalname}`)
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
      description: 'File to upload',
      type: 'multipart/form-data',
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })
    async uploadFile(@UploadedFile() file: Express.Multer.File){
        return { message: "success", filename: file.filename };
    }
}