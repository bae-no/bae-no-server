import { T } from '@app/custom/effect';
import { Service } from '@app/custom/nest/decorator/Service';
import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';
import { TicketGeneratorPort } from '@app/domain/generator/TicketGeneratorPort';
import { pipe } from 'fp-ts/function';

import { ShareDealQueryUseCase } from '../../../share-deal/application/port/in/ShareDealQueryUseCase';
import { Chat } from '../../domain/Chat';
import { ChatWrittenEvent } from '../../domain/event/ChatWrittenEvent';
import type { WriteChatError } from '../port/in/ChatCommandUseCase';
import { ChatCommandUseCase } from '../port/in/ChatCommandUseCase';
import type { WriteChatCommand } from '../port/in/dto/WriteChatCommand';
import { ChatRepositoryPort } from '../port/out/ChatRepositoryPort';

@Service()
export class ChatCommandService extends ChatCommandUseCase {
  constructor(
    private readonly shareDealQueryUseCase: ShareDealQueryUseCase,
    private readonly chatRepositoryPort: ChatRepositoryPort,
    private readonly eventEmitterPort: EventEmitterPort,
    private readonly ticketGeneratorPort: TicketGeneratorPort,
  ) {
    super();
  }

  override write(command: WriteChatCommand): T.IO<WriteChatError, void> {
    return pipe(
      this.shareDealQueryUseCase.participantIds(
        command.shareDealId,
        command.userId,
      ),
      T.map((participantIds) =>
        Chat.create(
          command.shareDealId,
          participantIds,
          command.userId,
          command.content,
          this.ticketGeneratorPort.generateId(),
        ),
      ),
      T.chain((chats) => this.chatRepositoryPort.create(chats)),
      T.tap((chats) =>
        T.succeedWith(() =>
          this.eventEmitterPort.emit(new ChatWrittenEvent(chats)),
        ),
      ),
    );
  }
}
