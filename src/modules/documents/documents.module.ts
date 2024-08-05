import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { IncomeDocumentController } from './document.income.controller';
import { GoingDocumentController } from './document.going.controller';
import { IncomeDocumentService } from './document.income.service';
import { GoingDocumentService } from './document.going.service';

@Module({
  imports: [JwtModule],
  controllers: [IncomeDocumentController, GoingDocumentController],
  providers: [IncomeDocumentService, GoingDocumentService]
})
export class DocumentsModule {}
