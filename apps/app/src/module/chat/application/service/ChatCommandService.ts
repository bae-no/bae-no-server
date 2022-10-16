import { TE } from '@app/custom/fp-ts';
import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';
import { Injectable } from '@nestjs/common';
import { constVoid, pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { ShareDealQueryRepositoryPort } from '../../../share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { ChatWrittenEvent } from '../../domain/event/ChatWrittenEvent';
import {
  ChatCommandUseCase,
  WriteChatError,
} from '../port/in/ChatCommandUseCase';
import { WriteChatCommand } from '../port/in/dto/WriteChatCommand';
import { ChatPermissionDeniedException } from '../port/in/exception/ChatPermissionDeniedException';
import { ChatRepositoryPort } from '../port/out/ChatRepositoryPort';

@Injectable()
export class ChatCommandService extends ChatCommandUseCase {
  constructor(
    private readonly shareDealQueryRepositoryPort: ShareDealQueryRepositoryPort,
    private readonly chatRepositoryPort: ChatRepositoryPort,
    private readonly eventEmitterPort: EventEmitterPort,
  ) {
    super();
  }

  override write(command: WriteChatCommand): TaskEither<WriteChatError, void> {
    return pipe(
      this.shareDealQueryRepositoryPort.findById(command.shareDealId),
      TE.filterOrElseW(
        (shareDeal) => shareDeal.canWriteChat(command.userId),
        () => new ChatPermissionDeniedException('채팅을 작성할 수 없습니다.'),
      ),
      TE.map((shareDeal) => shareDeal.newChat(command.userId, command.content)),
      TE.chainW((chats) => this.chatRepositoryPort.create(chats)),
      TE.map((chats) => new ChatWrittenEvent(chats)),
      TE.map((event) =>
        this.eventEmitterPort.emit(ChatWrittenEvent.EVENT_NAME, event.payload),
      ),
      TE.map(constVoid),
    );
  }
}
