import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';

import { ChatPermissionDeniedException } from '../../../src/module/chat/application/port/in/exception/ChatPermissionDeniedException';
import { ChatQueryService } from '../../../src/module/chat/application/service/ChatQueryService';
import { ShareDealQueryRepositoryPort } from '../../../src/module/share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { ParticipantInfo } from '../../../src/module/share-deal/domain/vo/ParticipantInfo';
import { assertResolvesLeft, assertResolvesRight } from '../../fixture';
import { ShareDealFactory } from '../../fixture/ShareDealFactory';

describe('ChatQueryService', () => {
  const shareDealQueryRepositoryPort = mock<ShareDealQueryRepositoryPort>();
  const chatQueryService = new ChatQueryService(shareDealQueryRepositoryPort);

  beforeEach(() => mockReset(shareDealQueryRepositoryPort));

  describe('isParticipant', () => {
    it('공유딜 참가자가 아니면 에러가 발생한다', async () => {
      // given
      const shareDeal = ShareDealFactory.create({ id: 'shareDealId' });

      shareDealQueryRepositoryPort.findById.mockReturnValue(right(shareDeal));

      // when
      const result = chatQueryService.isParticipant(
        shareDeal.id,
        'not match user',
      );

      // then
      await assertResolvesLeft(result, (exception) => {
        expect(exception).toBeInstanceOf(ChatPermissionDeniedException);
      });
    });

    it('참가자인 경우 검증에 성공한다', async () => {
      // given
      const shareDeal = ShareDealFactory.create({
        id: 'shareDealId',
        participantInfo: ParticipantInfo.of(['user 1', 'user 2'], 5),
      });

      shareDealQueryRepositoryPort.findById.mockReturnValue(right(shareDeal));

      // when
      const result = chatQueryService.isParticipant(
        shareDeal.id,
        shareDeal.participantInfo.ids[0],
      );

      // then
      await assertResolvesRight(result);
    });
  });
});
