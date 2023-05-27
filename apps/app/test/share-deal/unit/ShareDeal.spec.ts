import { describe, expect, it } from 'vitest';

import { ParticipantInfo } from '../../../src/module/share-deal/domain/vo/ParticipantInfo';
import { ShareDealStatus } from '../../../src/module/share-deal/domain/vo/ShareDealStatus';
import { UserId } from '../../../src/module/user/domain/User';
import { ShareDealFactory } from '../../fixture/ShareDealFactory';
import { assertLeft, assertRight } from '../../fixture/utils';

describe('ShareDeal', () => {
  describe('canWriteChat', () => {
    it('공유딜이 준비 상태가 아니면 작성할 수 없다', () => {
      // given
      const userId = UserId('userId');
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.OPEN,
        participantInfo: ParticipantInfo.of([UserId(userId)], 1),
      });

      // when
      const result = shareDeal.canWriteChat(userId);

      // then
      expect(result).toBe(false);
    });

    it('참가자가 아니면 작성할 수 없다', () => {
      // given
      const userId = UserId('userId');
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.START,
        participantInfo: ParticipantInfo.of([UserId('other user')], 1),
      });

      // when
      const result = shareDeal.canWriteChat(userId);

      // then
      expect(result).toBe(false);
    });

    it('준비 상태이면 작성할 수 있다', () => {
      // given
      const userId = UserId('userId');
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.READY,
        participantInfo: ParticipantInfo.of([UserId(userId)], 1),
      });

      // when
      const result = shareDeal.canWriteChat(userId);

      // then
      expect(result).toBe(true);
    });

    it('시작 상태이면 작성할 수 있다', () => {
      // given
      const userId = UserId('userId');
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.START,
        participantInfo: ParticipantInfo.of([UserId(userId)], 1),
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
      const userId = UserId('userId');
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.READY,
        ownerId: userId,
        participantInfo: ParticipantInfo.of([userId, 'user 2'].map(UserId), 4),
      });

      // when
      const result = shareDeal.canStart(userId);

      // then
      expect(result).toBe(true);
    });

    it('방장이 아닌 경우 시작할 수 없다', () => {
      // given
      const userId = UserId('userId');
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.OPEN,
        ownerId: UserId('user 2'),
        participantInfo: ParticipantInfo.of([userId, 'user 2'].map(UserId), 4),
      });

      // when
      const result = shareDeal.canStart(userId);

      // then
      expect(result).toBe(false);
    });

    it('준비 상태가 아닌 경우 시작할 수 없다', () => {
      // given
      const userId = UserId('userId');
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.OPEN,
        ownerId: userId,
        participantInfo: ParticipantInfo.of([userId, 'user 2'].map(UserId), 4),
      });

      // when
      const result = shareDeal.canStart(userId);

      // then
      expect(result).toBe(false);
    });

    it('참여 인원이 과반수가 아닐 경우 시작할 수 없다', () => {
      // given
      const userId = UserId('userId');
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.READY,
        ownerId: userId,
        participantInfo: ParticipantInfo.of([UserId(userId)], 4),
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
      const userId = UserId('userId');
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.START,
        ownerId: userId,
        participantInfo: ParticipantInfo.of([userId, 'user 2'].map(UserId), 4),
      });

      // when
      const result = shareDeal.canEnd(userId);

      // then
      expect(result).toBe(true);
    });

    it('방장이 아닌 경우 종료할 수 없다', () => {
      // given
      const userId = UserId('userId');
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.START,
        ownerId: UserId('user 2'),
        participantInfo: ParticipantInfo.of([userId, 'user 2'].map(UserId), 4),
      });

      // when
      const result = shareDeal.canEnd(userId);

      // then
      expect(result).toBe(false);
    });

    it('상태가 START 아닌 경우 종료될 수 없다.', () => {
      // given
      const userId = UserId('userId');
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.READY,
        ownerId: userId,
        participantInfo: ParticipantInfo.of([userId, 'user 2'].map(UserId), 4),
      });

      // when
      const result = shareDeal.canEnd(userId);

      // then
      expect(result).toBe(false);
    });
  });

  describe('canUpdate', () => {
    it('자신의 공유딜이 오픈 상태인 경우 수정할 수 있다.', () => {
      // given
      const ownerId = UserId('ownerId');
      const maxParticipants = 10;
      const shareDeal = ShareDealFactory.create({
        ownerId,
        status: ShareDealStatus.OPEN,
        participantInfo: ParticipantInfo.of(
          ['user1', 'user2'].map(UserId),
          maxParticipants,
        ),
      });

      // when
      const result = shareDeal.canUpdate(ownerId, maxParticipants);

      // then
      expect(result).toBe(true);
    });

    it('자신의 공유딜이 준비 상태인 경우 수정할 수 있다.', () => {
      // given
      const ownerId = UserId('ownerId');
      const maxParticipants = 10;
      const shareDeal = ShareDealFactory.create({
        ownerId,
        status: ShareDealStatus.READY,
        participantInfo: ParticipantInfo.of(
          ['user1', 'user2'].map(UserId),
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
        ownerId: UserId('ownerId'),
        participantInfo: ParticipantInfo.of(
          ['user1', 'user2'].map(UserId),
          maxParticipants,
        ),
      });
      const userId = UserId('userId');

      // when
      const result = shareDeal.canUpdate(userId, maxParticipants);

      // then
      expect(result).toBe(false);
    });

    it('오픈 상태가 아닌 경우 수정할 수 없다.', () => {
      // given
      const ownerId = UserId('ownerId');
      const maxParticipants = 10;
      const shareDeal = ShareDealFactory.create({
        ownerId,
        status: ShareDealStatus.START,
        participantInfo: ParticipantInfo.of(
          ['user1', 'user2'].map(UserId),
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
      const ownerId = UserId('ownerId');
      const maxParticipants = 1;
      const shareDeal = ShareDealFactory.create({
        ownerId,
        status: ShareDealStatus.START,
        participantInfo: ParticipantInfo.of(
          ['user1', 'user2'].map(UserId),
          maxParticipants,
        ),
      });

      // when
      const result = shareDeal.canUpdate(ownerId, maxParticipants);

      // then
      expect(result).toBe(false);
    });
  });

  describe('leave', () => {
    it('공유딜이 활성화 상태이고 방장이면 파기상태로 변경한다', () => {
      // given
      const ownerId = UserId('ownerId');
      const shareDeal = ShareDealFactory.createOpen({
        ownerId,
        participantInfo: ParticipantInfo.of([ownerId, 'user2'].map(UserId), 10),
      });

      // when
      const result = shareDeal.leave(ownerId);

      // then
      assertRight(result, (deal) => {
        expect(deal.status).toBe(ShareDealStatus.CLOSE);
        expect(deal.domainEvents).toHaveLength(1);
      });
    });

    it('참여자가 아니면 에러를 반환한다', () => {
      // given
      const shareDeal = ShareDealFactory.createOpen({
        ownerId: UserId('ownerId'),
        participantInfo: ParticipantInfo.of(['user1', 'user2'].map(UserId), 10),
      });

      // when
      const result = shareDeal.leave(UserId('user3'));

      // then
      assertLeft(result);
    });

    it('참가자 정보를 삭제한다', () => {
      // given
      const shareDeal = ShareDealFactory.createOpen({
        ownerId: UserId('ownerId'),
        participantInfo: ParticipantInfo.of(['user1', 'user2'].map(UserId), 10),
      });

      // when
      shareDeal.leave(UserId('user2'));

      // then
      expect(shareDeal.participantInfo.hasId(UserId('user2'))).toBe(false);
    });
  });
});
