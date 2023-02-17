import { TE } from '@app/custom/fp-ts';
import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';
import { TicketGeneratorPort } from '@app/domain/generator/TicketGeneratorPort';
import { Injectable } from '@nestjs/common';
import { pipe } from 'fp-ts/function';
import type { TaskEither } from 'fp-ts/TaskEither';

import { ShareDealQueryUseCase } from '../../../share-deal/application/port/in/ShareDealQueryUseCase';
import { Chat } from '../../domain/Chat';
import { ChatWrittenEvent } from '../../domain/event/ChatWrittenEvent';
import type { WriteChatError } from '../port/in/ChatCommandUseCase';
import { ChatCommandUseCase } from '../port/in/ChatCommandUseCase';
import type { WriteChatCommand } from '../port/in/dto/WriteChatCommand';
import { ChatRepositoryPort } from '../port/out/ChatRepositoryPort';

@Injectable()
export class ChatCommandService extends ChatCommandUseCase {
  constructor(
    private readonly shareDealQueryUseCase: ShareDealQueryUseCase,
    private readonly chatRepositoryPort: ChatRepositoryPort,
    private readonly eventEmitterPort: EventEmitterPort,
    private readonly ticketGeneratorPort: TicketGeneratorPort,
  ) {
    super();
  }

  override write(command: WriteChatCommand): TaskEither<WriteChatError, void> {
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
          this.ticketGeneratorPort.generateId(),
        ),
      ),
      TE.chainW((chats) => this.chatRepositoryPort.create(chats)),
      TE.map((chats) =>
        this.eventEmitterPort.emit(new ChatWrittenEvent(chats)),
      ),
    );
  }
}
