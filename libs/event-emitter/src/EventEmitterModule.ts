import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';
import { EventEmitterAdapter } from '@app/event-emitter/EventEmitterAdapter';
import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const connection: string = configService.getOrThrow(
          'REDIS_CONNECTION_NAME',
        );
        const parts = connection.split(':');

        return {
          connection: {
            host: parts.slice(0, -1).join(''),
            port: Number(parts.at(-1)),
          },
        };
      },
    }),
  ],
  providers: [{ provide: EventEmitterPort, useClass: EventEmitterAdapter }],
  exports: [EventEmitterPort],
})
export class EventEmitterModule {}
