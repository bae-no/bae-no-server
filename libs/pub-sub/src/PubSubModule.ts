import { PubSubPort } from '@app/domain/pub-sub/PubSubPort';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';

import { PubSubAdapter } from './PubSubAdapter';

@Global()
@Module({
  providers: [
    {
      provide: PubSubPort,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new PubSubAdapter(
          new RedisPubSub({
            connection: {
              host: configService.get('REDIS_HOST'),
              port: configService.get('REDIS_PORT'),
            },
          }),
        ),
    },
  ],
  exports: [PubSubPort],
})
export class PubSubModule {}
