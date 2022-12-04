import { TE } from '@app/custom/fp-ts';
import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';
import { Injectable } from '@nestjs/common';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { ShareDealQueryUseCase } from '../../../share-deal/application/port/in/ShareDealQueryUseCase';
import { Chat } from '../../domain/Chat';
import { ChatWrittenEvent } from '../../domain/event/ChatWrittenEvent';
import {
  ChatCommandUseCase,
  WriteChatError,
} from '../port/in/ChatCommandUseCase';
import { WriteChatCommand } from '../port/in/dto/WriteChatCommand';
import { ChatRepositoryPort } from '../port/out/ChatRepositoryPort';

@Injectable()
export class ChatCommandService extends ChatCommandUseCase {
  constructor(
    private readonly shareDealQueryUseCase: ShareDealQueryUseCase,
    private readonly chatRepositoryPort: ChatRepositoryPort,
    private readonly eventEmitterPort: EventEmitterPort,
  ) {
    super();
  }

  override write(
    command: WriteChatCommand,
    now = new Date(),
  ): TaskEither<WriteChatError, void> {
    return pipe(
      this.shareDealQueryUseCase.participantIds(
        command.shareDealId,
        command.userId,
      ),
      TE.map((participantIds) =>
        Chat.create(
          command.shareDealId,
          participantIds,
          command.userId,
          command.content,
          now.getTime(),
        ),
      ),
      TE.chainW((chats) => this.chatRepositoryPort.create(chats)),
      TE.map((chats) =>
        this.eventEmitterPort.emit(new ChatWrittenEvent(chats)),
      ),
    );
  }
}
