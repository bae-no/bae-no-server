import { Module } from '@nestjs/common';

import { UserMutationResolver } from './adapter/in/gql/UserMutationResolver';

@Module({
  providers: [UserMutationResolver],
})
export class UserModule {}
