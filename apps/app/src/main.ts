import { BaseExceptionFilter } from '@app/custom/nest/filter/BaseExceptionFilter';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './AppModule';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new BaseExceptionFilter());
  await app.listen(process.env.PORT || 3000);
}
void bootstrap().catch();
