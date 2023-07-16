import '@app/monitoring/init';

import { BaseExceptionFilter } from '@app/custom/nest/filter/BaseExceptionFilter';
import { EffectInterceptor } from '@app/custom/nest/interceptor/EffectInterceptor';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './AppModule';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new BaseExceptionFilter());
  app.useGlobalInterceptors(new EffectInterceptor());

  await app.listen(process.env.PORT || 3000);
}
void bootstrap().catch();
