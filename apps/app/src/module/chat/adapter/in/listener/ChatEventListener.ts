import { PubSubPort } from '@app/domain/pub-sub/PubSubPort';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { Chat } from '../../../domain/Chat';
import { ChatWrittenEvent } from '../../../domain/event/ChatWrittenEvent';
import { ChatWrittenResponse } from '../gql/response/ChatWrittenResponse';
import { ChatWrittenTrigger } from './ChatWritttenTrigger';

@Injectable()
export class ChatEventListener {
  constructor(private readonly pubSubPort: PubSubPort) {}

  @OnEvent(ChatWrittenEvent.EVENT_NAME)
  async handleChatWrittenEvent(payload: Chat) {
    this.pubSubPort.publish(
      ChatWrittenTrigger(payload.shareDealId),
      ChatWrittenResponse.of(payload.message),
    );
  }
}
