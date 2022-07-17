import * as path from 'path';

import { PrismaModule } from '@app/prisma/PrismaModule';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { SampleModule } from './module/sample/SampleModule';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: path.join(process.cwd(), 'schema/schema.gql'),
      sortSchema: true,
    }),
    PrismaModule,
    SampleModule,
  ],
})
export class AppModule {}
