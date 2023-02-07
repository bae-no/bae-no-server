import { TE } from '@app/custom/fp-ts';
import { DBError } from '@app/domain/error/DBError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { Injectable } from '@nestjs/common';
import { constVoid, pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { UserId } from '../../../user/domain/User';
import { ShareDealId } from '../../domain/ShareDeal';
import { ShareDealAccessDeniedException } from '../port/in/exception/ShareDealAccessDeniedException';
import { ShareDealQueryUseCase } from '../port/in/ShareDealQueryUseCase';
import { ShareDealQueryRepositoryPort } from '../port/out/ShareDealQueryRepositoryPort';

@Injectable()
export class ShareDealQueryService extends ShareDealQueryUseCase {
  constructor(
    private readonly shareDealQueryRepositoryPort: ShareDealQueryRepositoryPort,
  ) {
    super();
  }

  override isParticipant(
    shareDealId: ShareDealId,
    userId: UserId,
  ): TaskEither<DBError | ShareDealAccessDeniedException, void> {
    return pipe(
      this.shareDealQueryRepositoryPort.findById(shareDealId),
      TE.filterOrElseW(
        (shareDeal) => shareDeal.participantInfo.hasId(userId),
        () => new ShareDealAccessDeniedException('채팅에 참여할 수 없습니다.'),
      ),
      TE.map(constVoid),
    );
  }

  override participantIds(
    shareDealId: ShareDealId,
    userId: UserId,
  ): TaskEither<
    DBError | NotFoundException | ShareDealAccessDeniedException,
    UserId[]
  > {
    return pipe(
      this.shareDealQueryRepositoryPort.findById(shareDealId),
      TE.filterOrElseW(
        (shareDeal) => shareDeal.canWriteChat(userId),
        () =>
          new ShareDealAccessDeniedException(
            '채팅방에 참여할 권한이 없습니다.',
          ),
      ),
      TE.map((shareDeal) => shareDeal.participantInfo.ids),
    );
  }
}
