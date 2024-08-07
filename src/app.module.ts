import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Collaborating, IncomeDocument, Room, User, CommandTicket, GoingDocument, ProcessTicket } from './database/models';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { FileModule } from './modules/files/file.module';
import { RoomsModule } from './modules/room/room.module';
import { DocumentsModule } from './modules/documents/documents.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RoomsModule,
    FileModule,
    DocumentsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASS'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadModels: true,
        synchronize: true,
        models: [User, Room, IncomeDocument, Collaborating, CommandTicket, GoingDocument, ProcessTicket],
      })
    }),
  ],
})
export class AppModule {}
