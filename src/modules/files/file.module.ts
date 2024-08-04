import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { FileController } from './file.controller';

@Module({
  imports: [JwtModule],
  controllers: [FileController],
})
export class FileModule {}
