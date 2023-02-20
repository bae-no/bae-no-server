import { O, TE } from '@app/custom/fp-ts';
import { Service } from '@app/custom/nest/decorator/Service';
import type { DBError } from '@app/domain/error/DBError';
import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';
import { constant, pipe } from 'fp-ts/function';
import type { TaskEither } from 'fp-ts/TaskEither';

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

  override find(
    command: FindChatCommand,
  ): TaskEither<DBError, FindChatResult[]> {
    return pipe(
      TE.Do,
      TE.apS(
        'shareDeals',
        this.shareDealQueryRepositoryPort.findByUser(
          command.toShareDealCommand(),
        ),
      ),
      TE.bind('join', ({ shareDeals }) =>
        pipe(
          TE.Do,
          TE.apS(
            'lastChats',
            TE.sequenceArray(
              shareDeals.map((deal) =>
                this.chatQueryRepository.last(deal.id, command.userId),
              ),
            ),
          ),
          TE.apS(
            'unreadCounts',
            TE.sequenceArray(
              shareDeals.map((deal) =>
                this.chatQueryRepository.unreadCount(deal.id, command.userId),
              ),
            ),
          ),
        ),
      ),
      TE.map(({ shareDeals, join: { lastChats, unreadCounts } }) =>
        shareDeals.map(
          (deal, index) =>
            new FindChatResult(
              deal.id,
              deal.title,
              deal.thumbnail,
              pipe(
                lastChats[index],
                O.map((chat) => chat.content),
                O.getOrElse(constant('')),
              ),
              unreadCounts[index],
            ),
        ),
      ),
    );
  }

  override findByUser(
    command: FindChatByUserCommand,
  ): TaskEither<DBError, FindByUserDto[]> {
    return pipe(
      TE.Do,
      TE.apS('chats', this.chatQueryRepository.findByUser(command)),
      TE.bind('authors', ({ chats }) =>
        this.userQueryRepositoryPort.findByIds(
          chats.map((chat) => chat.message.authorId),
        ),
      ),
      TE.map((result) => {
        this.eventEmitterPort.emit(
          new ChatReadEvent(command.userId, command.shareDealId),
        );

        return result;
      }),
      TE.map(({ chats, authors }) =>
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
    );
  }
}
