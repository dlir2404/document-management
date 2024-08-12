import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Document Management')
    .setDescription('The document management API description')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.setGlobalPrefix('api/')
  document.paths = Object.keys(document.paths).reduce((acc, path) => {
    acc[`/api${path}`] = document.paths[path];
    return acc;
  }, {});

  app.enableCors()

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  app.useStaticAssets(path.join(__dirname, '../uploads'))

  await app.listen(port, () => {
    console.log("App is running on port: ", port)
  });
}
bootstrap();
