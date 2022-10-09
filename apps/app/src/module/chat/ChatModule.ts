import { Module } from '@nestjs/common';

import { ChatMutationResolver } from './adapter/in/gql/ChatMutationResolver';

@Module({
  providers: [ChatMutationResolver],
})
export class ChatModule {}
