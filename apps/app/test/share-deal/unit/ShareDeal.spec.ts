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

  describe('canStart', () => {
    it('유효한 상태이면 시작할 수 있다', () => {
      // given
      const userId = 'userId';
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.OPEN,
        ownerId: userId,
        participantInfo: ParticipantInfo.of([userId, 'user 2'], 4),
      });

      // when
      const result = shareDeal.canStart(userId);

      // then
      expect(result).toBe(true);
    });

    it('방장이 아닌 경우 시작할 수 없다', () => {
      // given
      const userId = 'userId';
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.OPEN,
        ownerId: 'user 2',
        participantInfo: ParticipantInfo.of([userId, 'user 2'], 4),
      });

      // when
      const result = shareDeal.canStart(userId);

      // then
      expect(result).toBe(false);
    });

    it('상태가 OPEN이 아닌 경우 시작할 수 없다', () => {
      // given
      const userId = 'userId';
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.START,
        ownerId: userId,
        participantInfo: ParticipantInfo.of([userId, 'user 2'], 4),
      });

      // when
      const result = shareDeal.canStart(userId);

      // then
      expect(result).toBe(false);
    });

    it('참여 인원이 과반수가 아닐 경우 시작할 수 없다', () => {
      // given
      const userId = 'userId';
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.OPEN,
        ownerId: userId,
        participantInfo: ParticipantInfo.of([userId], 4),
      });

      // when
      const result = shareDeal.canStart(userId);

      // then
      expect(result).toBe(false);
    });
  });

  describe('canEnd', () => {
    it('유효한 상태이면 종료할 수 있다', () => {
      // given
      const userId = 'userId';
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.START,
        ownerId: userId,
        participantInfo: ParticipantInfo.of([userId, 'user 2'], 4),
      });

      // when
      const result = shareDeal.canEnd(userId);

      // then
      expect(result).toBe(true);
    });

    it('방장이 아닌 경우 종료할 수 없다', () => {
      // given
      const userId = 'userId';
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.START,
        ownerId: 'user 2',
        participantInfo: ParticipantInfo.of([userId, 'user 2'], 4),
      });

      // when
      const result = shareDeal.canEnd(userId);

      // then
      expect(result).toBe(false);
    });

    it('상태가 START 아닌 경우 종료될 수 없다.', () => {
      // given
      const userId = 'userId';
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.OPEN,
        ownerId: userId,
        participantInfo: ParticipantInfo.of([userId, 'user 2'], 4),
      });

      // when
      const result = shareDeal.canEnd(userId);

      // then
      expect(result).toBe(false);
    });
  });

  describe('canUpdate', () => {
    it('자신의 공유딜이 시작 상태인 경우 수정할 수 있다.', () => {
      // given
      const ownerId = 'ownerId';
      const maxParticipants = 10;
      const shareDeal = ShareDealFactory.create({
        ownerId,
        status: ShareDealStatus.OPEN,
        participantInfo: ParticipantInfo.of(
          ['user1', 'user2'],
          maxParticipants,
        ),
      });

      // when
      const result = shareDeal.canUpdate(ownerId, maxParticipants);

      // then
      expect(result).toBe(true);
    });

    it('방장이 아닌 경우 수정할 수 없다.', () => {
      // given
      const maxParticipants = 10;
      const shareDeal = ShareDealFactory.createOpen({
        ownerId: 'ownerId',
        participantInfo: ParticipantInfo.of(
          ['user1', 'user2'],
          maxParticipants,
        ),
      });
      const userId = 'userId';

      // when
      const result = shareDeal.canUpdate(userId, maxParticipants);

      // then
      expect(result).toBe(false);
    });

    it('오픈 상태가 아닌 경우 수정할 수 없다.', () => {
      // given
      const ownerId = 'ownerId';
      const maxParticipants = 10;
      const shareDeal = ShareDealFactory.create({
        ownerId,
        status: ShareDealStatus.START,
        participantInfo: ParticipantInfo.of(
          ['user1', 'user2'],
          maxParticipants,
        ),
      });

      // when
      const result = shareDeal.canUpdate(ownerId, maxParticipants);

      // then
      expect(result).toBe(false);
    });

    it('현재 참여 인원수 보다 작은 인원수로 수정할 경우 실패한다.', () => {
      // given
      const ownerId = 'ownerId';
      const maxParticipants = 1;
      const shareDeal = ShareDealFactory.create({
        ownerId,
        status: ShareDealStatus.START,
        participantInfo: ParticipantInfo.of(
          ['user1', 'user2'],
          maxParticipants,
        ),
      });

      // when
      const result = shareDeal.canUpdate(ownerId, maxParticipants);

      // then
      expect(result).toBe(false);
    });
  });
});
