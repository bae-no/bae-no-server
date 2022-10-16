import { TE } from '@app/custom/fp-ts';
import { DBError } from '@app/domain/error/DBError';
import { Injectable } from '@nestjs/common';
import { constVoid, pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { ShareDealQueryRepositoryPort } from '../../../share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { ChatQueryUseCase } from '../port/in/ChatQueryUseCase';
import { ChatPermissionDeniedException } from '../port/in/exception/ChatPermissionDeniedException';

@Injectable()
export class ChatQueryService extends ChatQueryUseCase {
  constructor(
    private readonly shareDealQueryRepositoryPort: ShareDealQueryRepositoryPort,
  ) {
    super();
  }

  override isParticipant(
    shareDealId: string,
    userId: string,
  ): TaskEither<DBError | ChatPermissionDeniedException, void> {
    return pipe(
      this.shareDealQueryRepositoryPort.findById(shareDealId),
      TE.filterOrElseW(
        (shareDeal) => shareDeal.participantInfo.hasId(userId),
        () => new ChatPermissionDeniedException('채팅에 참여할 수 없습니다.'),
      ),
      TE.map(constVoid),
    );
  }
}
