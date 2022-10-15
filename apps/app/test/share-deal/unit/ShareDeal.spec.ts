import { ParticipantInfo } from '../../../src/module/share-deal/domain/vo/ParticipantInfo';
import { ShareDealStatus } from '../../../src/module/share-deal/domain/vo/ShareDealStatus';
import { ShareDealFactory } from '../../fixture/ShareDealFactory';

describe('ShareDeal', () => {
  describe('canWriteChat', () => {
    it('공유딜이 시작 상태가 아니면 작성할 수 없다', () => {
      // given
      const userId = 'userId';
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.CLOSE,
        participantInfo: ParticipantInfo.of([userId], 1),
      });

      // when
      const result = shareDeal.canWriteChat(userId);

      // then
      expect(result).toBe(false);
    });

    it('참가자가 아니면 작성할 수 없다', () => {
      // given
      const userId = 'userId';
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.START,
        participantInfo: ParticipantInfo.of(['other user'], 1),
      });

      // when
      const result = shareDeal.canWriteChat(userId);

      // then
      expect(result).toBe(false);
    });

    it('유효한 상태이면 작성할 수 있다', () => {
      // given
      const userId = 'userId';
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.START,
        participantInfo: ParticipantInfo.of([userId], 1),
      });

      // when
      const result = shareDeal.canWriteChat(userId);

      // then
      expect(result).toBe(true);
    });
  });
});
