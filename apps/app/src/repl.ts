import { repl } from '@nestjs/core';

import { AppModule } from './AppModule';

async function bootstrap() {
  await repl(AppModule);
}
void bootstrap().catch();
