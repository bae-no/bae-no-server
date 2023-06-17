import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';
import { PushMessagePort } from '@app/domain/notification/PushMessagePort';
import { PubSubPort } from '@app/domain/pub-sub/PubSubPort';
import { PrismaService } from '@app/prisma/PrismaService';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    { provide: EventEmitterPort, useValue: {} },
    { provide: PushMessagePort, useValue: {} },
    { provide: PubSubPort, useValue: {} },
    { provide: ConfigService, useValue: { getOrThrow: () => 'config' } },
    { provide: PrismaService, useValue: {} },
  ],
  exports: [
    EventEmitterPort,
    PushMessagePort,
    PubSubPort,
    ConfigService,
    PrismaService,
  ],
})
export class TestInfraModule {}
