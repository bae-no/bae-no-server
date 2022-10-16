import * as path from 'path';

import { EventEmitterModule } from '@app/event-emitter/EventEmitterModule';
import { PrismaModule } from '@app/prisma/PrismaModule';
import { PubSubModule } from '@app/pub-sub/PubSubModule';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
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

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'schema/schema.gql'),
      sortSchema: true,
      subscriptions: {
        'graphql-ws': true,
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
    CategoryModule,
    SampleModule,
    UserModule,
    ChatModule,
    ShareDealModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlAuthGuard,
    },
  ],
})
export class AppModule {}
