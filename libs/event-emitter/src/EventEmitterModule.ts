import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';
import { EventDispatcher } from '@app/event-emitter/EventDispatcher';
import { EventEmitterAdapter } from '@app/event-emitter/EventEmitterAdapter';
import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DiscoveryModule } from '@nestjs/core';
import { Redis } from 'ioredis';

@Global()
@Module({
  imports: [
    DiscoveryModule,
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const connection: string = configService.getOrThrow(
          'REDIS_CONNECTION_NAME',
        );
        const redis = new Redis(connection, { maxRetriesPerRequest: null });

        return { connection: redis };
      },
    }),
    BullModule.registerQueue({
      name: 'event-emitter',
    }),
  ],
  providers: [
    { provide: EventEmitterPort, useClass: EventEmitterAdapter },
    EventDispatcher,
  ],
  exports: [EventEmitterPort],
})
export class EventEmitterModule {}
