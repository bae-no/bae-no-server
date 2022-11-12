import { PushMessageAdapter } from '@app/push-message/PushMessageAdapter';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [PushMessageAdapter],
  exports: [PushMessageAdapter],
})
export class PushMessageModule {}
