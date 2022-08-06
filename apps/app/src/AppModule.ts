import * as path from 'path';

import { PrismaModule } from '@app/prisma/PrismaModule';
import { PubSubModule } from '@app/pub-sub/PubSubModule';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

import { CategoryModule } from './module/category/CategoryModule';
import { SampleModule } from './module/sample/SampleModule';
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
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    PubSubModule,
    CategoryModule,
    SampleModule,
    UserModule,
  ],
})
export class AppModule {}
