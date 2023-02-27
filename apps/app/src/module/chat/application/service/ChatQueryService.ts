import { T, O, pipe } from '@app/custom/effect';
import { Service } from '@app/custom/nest/decorator/Service';
import type { DBError } from '@app/domain/error/DBError';
import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';

import { ShareDealQueryRepositoryPort } from '../../../share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { UserQueryRepositoryPort } from '../../../user/application/port/out/UserQueryRepositoryPort';
import type { User } from '../../../user/domain/User';
import { ChatReadEvent } from '../../domain/event/ChatReadEvent';
import { ChatQueryUseCase } from '../port/in/ChatQueryUseCase';
import { FindByUserDto } from '../port/in/dto/FindByUserDto';
import type { FindChatByUserCommand } from '../port/in/dto/FindChatByUserCommand';
import type { FindChatCommand } from '../port/in/dto/FindChatCommand';
import { FindChatResult } from '../port/in/dto/FindChatResult';
import { ChatQueryRepositoryPort } from '../port/out/ChatQueryRepositoryPort';

@Service()
export class ChatQueryService extends ChatQueryUseCase {
  constructor(
    private readonly shareDealQueryRepositoryPort: ShareDealQueryRepositoryPort,
    private readonly chatQueryRepository: ChatQueryRepositoryPort,
    private readonly userQueryRepositoryPort: UserQueryRepositoryPort,
    private readonly eventEmitterPort: EventEmitterPort,
  ) {
    super();
  }

  override find(command: FindChatCommand): T.IO<DBError, FindChatResult[]> {
    return pipe(
      this.shareDealQueryRepositoryPort.findByUser(
        command.toShareDealCommand(),
      ),
      T.chain((shareDeals) =>
        T.structPar({
          shareDeals: T.succeed(shareDeals),
          join: T.structPar({
            lastChats: T.forEachPar_(shareDeals, (deal) =>
              this.chatQueryRepository.last(deal.id, command.userId),
            ),
            unreadCounts: T.forEachPar_(shareDeals, (deal) =>
              this.chatQueryRepository.unreadCount(deal.id, command.userId),
            ),
          }),
        }),
      ),
      T.map(({ shareDeals, join: { lastChats, unreadCounts } }) =>
        shareDeals.map(
          (deal, index) =>
            new FindChatResult(
              deal.id,
              deal.title,
              deal.thumbnail,
              pipe(
                [...lastChats][index],
                O.map((chat) => chat.content),
                O.getOrElse(() => ''),
              ),
              [...unreadCounts][index],
            ),
        ),
      ),
    );
  }

  override findByUser(
    command: FindChatByUserCommand,
  ): T.IO<DBError, FindByUserDto[]> {
    return pipe(
      this.chatQueryRepository.findByUser(command),
      T.chain((chats) =>
        T.structPar({
          chats: T.succeed(chats),
          authors: this.userQueryRepositoryPort.findByIds(
            chats.map((chat) => chat.message.authorId),
          ),
        }),
      ),
      T.map(({ chats, authors }) =>
        chats.map(
          (chat) =>
            new FindByUserDto(
              chat,
              authors.find(
                (author) => author.id === chat.message.authorId,
              ) as User,
            ),
        ),
      ),
      T.tap(() =>
        T.succeedWith(() =>
          this.eventEmitterPort.emit(
            new ChatReadEvent(command.userId, command.shareDealId),
          ),
        ),
      ),
    );
  }
}
