import { constVoid, pipe, T } from '@app/custom/effect';
import { Service } from '@app/custom/nest/decorator/Service';
import type { DBError } from '@app/domain/error/DBError';
import type { NotFoundException } from '@app/domain/exception/NotFoundException';

import type { UserId } from '../../../user/domain/User';
import type { ShareDealId } from '../../domain/ShareDeal';
import { ShareDealAccessDeniedException } from '../port/in/exception/ShareDealAccessDeniedException';
import { ShareDealQueryUseCase } from '../port/in/ShareDealQueryUseCase';
import { ShareDealQueryRepositoryPort } from '../port/out/ShareDealQueryRepositoryPort';

@Service()
export class ShareDealQueryService extends ShareDealQueryUseCase {
  constructor(
    private readonly shareDealQueryRepositoryPort: ShareDealQueryRepositoryPort,
  ) {
    super();
  }

  override isParticipant(
    shareDealId: ShareDealId,
    userId: UserId,
  ): T.IO<DBError | ShareDealAccessDeniedException, void> {
    return pipe(
      this.shareDealQueryRepositoryPort.findByIdE(shareDealId),
      T.filterOrElse(
        (shareDeal) => shareDeal.participantInfo.hasId(userId),
        () =>
          T.fail(
            new ShareDealAccessDeniedException('채팅에 참여할 수 없습니다.'),
          ),
      ),
      T.map(constVoid),
    );
  }

  override participantIds(
    shareDealId: ShareDealId,
    userId: UserId,
  ): T.IO<
    DBError | NotFoundException | ShareDealAccessDeniedException,
    UserId[]
  > {
    return pipe(
      this.shareDealQueryRepositoryPort.findByIdE(shareDealId),
      T.filterOrElse(
        (shareDeal) => shareDeal.canWriteChat(userId),
        () =>
          T.fail(
            new ShareDealAccessDeniedException(
              '채팅방에 참여할 권한이 없습니다.',
            ),
          ),
      ),
      T.map((shareDeal) => shareDeal.participantInfo.ids),
    );
  }
}
