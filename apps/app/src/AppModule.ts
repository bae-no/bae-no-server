import * as path from 'path';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
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

import { CategoryModule } from './module/category/CategoryModule';
import { ChatModule } from './module/chat/ChatModule';
import { SampleModule } from './module/sample/SampleModule';
import { ShareDealModule } from './module/share-deal/ShareDealModule';
import { GqlAuthGuard } from './module/user/adapter/in/gql/auth/GqlAuthGuard';
import { UserModule } from './module/user/UserModule';
import { UserPushTokenModule } from './module/user-push-token/UserPushTokenModule';

export const INFRA_MODULES = [
  GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile:
      process.env.NODE_ENV !== 'production'
        ? path.join(process.cwd(), 'schema/schema.gql')
        : true,
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
  ConfigModule.forRoot({ isGlobal: true }),
  OTELModule,
  EventEmitterModule,
  PrismaModule,
  PubSubModule,
  PushMessageModule,
];

export const BUSINESS_MODULES = [
  CategoryModule,
  SampleModule,
  UserModule,
  ChatModule,
  ShareDealModule,
  UserPushTokenModule,
];

@Module({
  imports: [...INFRA_MODULES, ...BUSINESS_MODULES],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlAuthGuard,
    },
  ],
})
export class AppModule {}
