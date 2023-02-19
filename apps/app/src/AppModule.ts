import * as path from 'path';

import { OTELModule } from '@app/custom/nest/aop/OTELModule';
import { EventEmitterModule } from '@app/event-emitter/EventEmitterModule';
import { PrismaModule } from '@app/prisma/PrismaModule';
import { PubSubModule } from '@app/pub-sub/PubSubModule';
import { PushMessageModule } from '@app/push-message/PushMessageModule';
import type { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

import { CategoryModule } from './module/category/CategoryModule';
import { ChatModule } from './module/chat/ChatModule';
import { SampleModule } from './module/sample/SampleModule';
import { ShareDealModule } from './module/share-deal/ShareDealModule';
import { GqlAuthGuard } from './module/user/adapter/in/gql/auth/GqlAuthGuard';
import { UserModule } from './module/user/UserModule';
import { UserPushTokenModule } from './module/user-push-token/UserPushTokenModule';

@Module({
  imports: [
    OTELModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      context: (context) => {
        if (context?.extra?.request) {
          return {
            req: {
              ...context?.extra?.request,
              headers: {
                ...context?.extra?.request?.headers,
                ...context?.connectionParams,
              },
            },
          };
        }

        return { req: context?.req };
      },
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'schema/schema.gql'),
      sortSchema: true,
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': false,
      },
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      introspection: true,
      cache: 'bounded',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule,
    PrismaModule,
    PubSubModule,
    PushMessageModule,
    CategoryModule,
    SampleModule,
    UserModule,
    ChatModule,
    ShareDealModule,
    UserPushTokenModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlAuthGuard,
    },
  ],
})
export class AppModule {}
