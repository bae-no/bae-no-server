import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';
import { EventEmitterAdapter } from '@app/event-emitter/EventEmitterAdapter';
import { Global, Module } from '@nestjs/common';
import { EventEmitterModule as EMM } from '@nestjs/event-emitter';

@Global()
@Module({
  imports: [EMM.forRoot()],
  providers: [{ provide: EventEmitterPort, useClass: EventEmitterAdapter }],
  exports: [EventEmitterPort],
})
export class EventEmitterModule {}
