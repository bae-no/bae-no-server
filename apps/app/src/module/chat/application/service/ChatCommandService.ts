import { T, pipe } from '@app/custom/effect';
import { Service } from '@app/custom/nest/decorator/Service';
import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';
import { TicketGeneratorPort } from '@app/domain/generator/TicketGeneratorPort';

import { ShareDealAccessDeniedException } from '../../../share-deal/application/port/in/exception/ShareDealAccessDeniedException';
import { ShareDealQueryRepositoryPort } from '../../../share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { Chat } from '../../domain/Chat';
import { ChatWrittenEvent } from '../../domain/event/ChatWrittenEvent';
import type { WriteChatError } from '../port/in/ChatCommandUseCase';
import { ChatCommandUseCase } from '../port/in/ChatCommandUseCase';
import type { WriteChatCommand } from '../port/in/dto/WriteChatCommand';
import { ChatRepositoryPort } from '../port/out/ChatRepositoryPort';

@Service()
export class ChatCommandService extends ChatCommandUseCase {
  constructor(
    private readonly chatRepositoryPort: ChatRepositoryPort,
    private readonly eventEmitterPort: EventEmitterPort,
    private readonly ticketGeneratorPort: TicketGeneratorPort,
    private readonly shareDealQueryRepositoryPort: ShareDealQueryRepositoryPort,
  ) {
    super();
  }

  override write(command: WriteChatCommand): T.IO<WriteChatError, void> {
    return pipe(
      this.shareDealQueryRepositoryPort.findById(command.shareDealId),
      T.filterOrElse(
        (shareDeal) => shareDeal.canWriteChat(command.userId),
        () =>
          T.fail(
            new ShareDealAccessDeniedException(
              '채팅방에 참여할 권한이 없습니다.',
            ),
          ),
      ),
      T.map((shareDeal) =>
        Chat.create(
          command.shareDealId,
          shareDeal.participantInfo.ids,
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
