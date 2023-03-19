import { T } from '@app/custom/effect';
import { beforeEach, describe, expect, it } from 'vitest';
import { mock, mockReset } from 'vitest-mock-extended';

import { ShareDealAccessDeniedException } from '../../../src/module/share-deal/application/port/in/exception/ShareDealAccessDeniedException';
import type { ShareDealQueryRepositoryPort } from '../../../src/module/share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { ShareDealQueryService } from '../../../src/module/share-deal/application/service/ShareDealQueryService';
import { ShareDealId } from '../../../src/module/share-deal/domain/ShareDeal';
import { ParticipantInfo } from '../../../src/module/share-deal/domain/vo/ParticipantInfo';
import { ShareDealStatus } from '../../../src/module/share-deal/domain/vo/ShareDealStatus';
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

  describe('participantIds', () => {
    it('OPEN 상태인 공유딜이 아닌 경우 에러가 발생한다.', async () => {
      // given
      const shareDeal = ShareDealFactory.create({
        id: ShareDealId('shareDealId'),
        status: ShareDealStatus.END,
        participantInfo: ParticipantInfo.of([UserId('user')], 2),
      });

      shareDealQueryRepositoryPort.findById.mockReturnValue(
        T.succeed(shareDeal),
      );

      // when
      const result = shareDealQueryService.participantIds(
        shareDeal.id,
        shareDeal.participantInfo.ids[0],
      );

      // then
      await assertResolvesFail(result, (exception) => {
        expect(exception).toBeInstanceOf(ShareDealAccessDeniedException);
      });
    });

    it('OPEN된 공유딜의 참가자인 경우 참여자들의 ID 목록을 조회한다.', async () => {
      // given
      const shareDeal = ShareDealFactory.create({
        id: ShareDealId('shareDealId'),
        status: ShareDealStatus.START,
        participantInfo: ParticipantInfo.of(
          ['user 1', 'user 2'].map(UserId),
          5,
        ),
      });

      shareDealQueryRepositoryPort.findById.mockReturnValue(
        T.succeed(shareDeal),
      );

      // when
      const result = shareDealQueryService.participantIds(
        shareDeal.id,
        shareDeal.participantInfo.ids[0],
      );

      // then
      await assertResolvesSuccess(result, (value) => {
        expect(value).toEqual(['user 1', 'user 2']);
      });
    });
  });
});
