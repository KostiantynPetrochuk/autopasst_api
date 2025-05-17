import { join } from 'node:path';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useLogger(app.get(LoggerService));
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8080);
}
bootstrap();
