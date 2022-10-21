import { TE } from '@app/custom/fp-ts';
import { DBError } from '@app/domain/error/DBError';
import { Injectable } from '@nestjs/common';
import { constVoid, pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

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
    shareDealId: string,
    userId: string,
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
}
