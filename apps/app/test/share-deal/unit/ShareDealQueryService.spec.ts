import { T } from '@app/custom/effect';
import { beforeEach, describe, expect, it } from 'vitest';
import { mock, mockReset } from 'vitest-mock-extended';

import { ShareDealAccessDeniedException } from '../../../src/module/share-deal/application/port/in/exception/ShareDealAccessDeniedException';
import type { ShareDealQueryRepositoryPort } from '../../../src/module/share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { ShareDealQueryService } from '../../../src/module/share-deal/application/service/ShareDealQueryService';
import { ShareDealId } from '../../../src/module/share-deal/domain/ShareDeal';
import { ParticipantInfo } from '../../../src/module/share-deal/domain/vo/ParticipantInfo';
import { UserId } from '../../../src/module/user/domain/User';
import { ShareDealFactory } from '../../fixture/ShareDealFactory';
import { assertResolvesFail, assertResolvesSuccess } from '../../fixture/utils';

describe('ShareDealQueryService', () => {
  const shareDealQueryRepositoryPort = mock<ShareDealQueryRepositoryPort>();
  const shareDealQueryService = new ShareDealQueryService(
    shareDealQueryRepositoryPort,
  );

  beforeEach(() => mockReset(shareDealQueryRepositoryPort));

  describe('isParticipant', () => {
    it('공유딜 참가자가 아니면 에러가 발생한다', async () => {
      // given
      const shareDeal = ShareDealFactory.create({
        id: ShareDealId('shareDealId'),
      });

      shareDealQueryRepositoryPort.findById.mockReturnValue(
        T.succeed(shareDeal),
      );

      // when
      const result = shareDealQueryService.isParticipant(
        shareDeal.id,
        UserId('not match user'),
      );

      // then
      await assertResolvesFail(result, (exception) => {
        expect(exception).toBeInstanceOf(ShareDealAccessDeniedException);
      });
    });

    it('참가자인 경우 검증에 성공한다', async () => {
      // given
      const shareDeal = ShareDealFactory.create({
        id: ShareDealId('shareDealId'),
        participantInfo: ParticipantInfo.of(
          ['user 1', 'user 2'].map(UserId),
          5,
        ),
      });

      shareDealQueryRepositoryPort.findById.mockReturnValue(
        T.succeed(shareDeal),
      );

      // when
      const result = shareDealQueryService.isParticipant(
        shareDeal.id,
        shareDeal.participantInfo.ids[0],
      );

      // then
      await assertResolvesSuccess(result);
    });
  });
});
