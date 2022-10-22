import { O, TE } from '@app/custom/fp-ts';
import { DBError } from '@app/domain/error/DBError';
import { Injectable } from '@nestjs/common';
import { constant, pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { ShareDealQueryRepositoryPort } from '../../../share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { ChatQueryUseCase } from '../port/in/ChatQueryUseCase';
import { FindChatCommand } from '../port/in/dto/FindChatCommand';
import { FindChatResult } from '../port/in/dto/FindChatResult';
import { ChatQueryRepositoryPort } from '../port/out/ChatQueryRepositoryPort';

@Injectable()
export class ChatQueryService extends ChatQueryUseCase {
  constructor(
    private readonly shareDealQueryRepositoryPort: ShareDealQueryRepositoryPort,
    private readonly chatQueryRepository: ChatQueryRepositoryPort,
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
}
