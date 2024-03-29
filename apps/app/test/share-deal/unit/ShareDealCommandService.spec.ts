import { T } from '@app/custom/effect';
import { IllegalStateException } from '@app/domain/exception/IllegalStateException';
import { beforeEach, describe, expect, it } from 'vitest';
import { mock, mockReset } from 'vitest-mock-extended';

import { StubEventEmitter } from '../../../../../libs/event-emitter/test/fixture/StubEventEmitter';
import { EndShareDealCommand } from '../../../src/module/share-deal/application/port/in/dto/EndShareDealCommand';
import { JoinShareDealCommand } from '../../../src/module/share-deal/application/port/in/dto/JoinShareDealCommand';
import { LeaveShareDealCommand } from '../../../src/module/share-deal/application/port/in/dto/LeaveShareDealCommand';
import { OpenShareDealCommand } from '../../../src/module/share-deal/application/port/in/dto/OpenShareDealCommand';
import { StartShareDealCommand } from '../../../src/module/share-deal/application/port/in/dto/StartShareDealCommand';
import { UpdateShareDealCommand } from '../../../src/module/share-deal/application/port/in/dto/UpdateShareDealCommand';
import { NotJoinableShareDealException } from '../../../src/module/share-deal/application/port/in/exception/NotJoinableShareDealException';
import type { ShareDealQueryRepositoryPort } from '../../../src/module/share-deal/application/port/out/ShareDealQueryRepositoryPort';
import type { ShareDealRepositoryPort } from '../../../src/module/share-deal/application/port/out/ShareDealRepositoryPort';
import { ShareDealCommandService } from '../../../src/module/share-deal/application/service/ShareDealCommandService';
import { ShareDealId } from '../../../src/module/share-deal/domain/ShareDeal';
import { FoodCategory } from '../../../src/module/share-deal/domain/vo/FoodCategory';
import { ParticipantInfo } from '../../../src/module/share-deal/domain/vo/ParticipantInfo';
import { ShareDealStatus } from '../../../src/module/share-deal/domain/vo/ShareDealStatus';
import { UserId } from '../../../src/module/user/domain/User';
import { AddressSystem } from '../../../src/module/user/domain/vo/AddressSystem';
import { ShareDealFactory } from '../../fixture/ShareDealFactory';
import { assertResolvesFail, assertResolvesSuccess } from '../../fixture/utils';

describe('ShareDealCommandService', () => {
  const shareDealRepositoryPort = mock<ShareDealRepositoryPort>();
  const shareDealQueryRepositoryPort = mock<ShareDealQueryRepositoryPort>();
  const eventEmitter = new StubEventEmitter();
  const shareDealCommandService = new ShareDealCommandService(
    shareDealRepositoryPort,
    shareDealQueryRepositoryPort,
  );

  beforeEach(() => {
    mockReset(shareDealRepositoryPort);
    mockReset(shareDealQueryRepositoryPort);
    eventEmitter.clear();
  });

  describe('open', () => {
    it('공유딜 생성 요청을 수행한다.', async () => {
      // given
      const command = new OpenShareDealCommand(
        UserId('userId'),
        'title',
        FoodCategory.AMERICAN,
        10,
        1000,
        'store',
        'thumbnail',
        AddressSystem.ROAD,
        'road',
        'detail',
        123,
        45,
      );

      shareDealRepositoryPort.save.mockReturnValue(
        T.succeed(
          command
            .toDomain()
            .setBase(ShareDealId('shareDealId'), new Date(), new Date()),
        ),
      );

      // when
      const result = shareDealCommandService.open(command);

      // then
      await assertResolvesSuccess(result, (value) => {
        expect(value).toBe('shareDealId');
      });
    });
  });

  describe('join', () => {
    it('채팅 참여가 불가능한 공유딜에 참여 요청할 경우 NotOpenShareDealException이 반환된다.', async () => {
      // given
      const command = new JoinShareDealCommand(
        UserId('userId'),
        ShareDealId('shareDealId'),
      );
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.START,
      });

      shareDealQueryRepositoryPort.findById.mockReturnValue(
        T.succeed(shareDeal),
      );

      // when
      const result = shareDealCommandService.join(command);

      // then
      await assertResolvesFail(result, (value) => {
        expect(value).toBeInstanceOf(NotJoinableShareDealException);
      });
    });

    it('공유딜 채팅방 참여를 요청한다.', async () => {
      // given
      const command = new JoinShareDealCommand(
        UserId('userId'),
        ShareDealId('shareDealId'),
      );
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.OPEN,
      });

      shareDealQueryRepositoryPort.findById.mockReturnValue(
        T.succeed(shareDeal),
      );
      shareDealRepositoryPort.save.mockReturnValue(T.succeed(shareDeal));

      // when
      const result = shareDealCommandService.join(command);

      // then
      await assertResolvesSuccess(result, () => {
        expect(shareDeal.participantInfo.hasId(command.userId)).toBe(true);
      });
    });
  });

  describe('start', () => {
    it('방장은 공유딜을 시작할 수 있다', async () => {
      // given
      const command = new StartShareDealCommand(
        UserId('userId'),
        ShareDealId('shareDealId'),
      );
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.READY,
        ownerId: command.userId,
        participantInfo: ParticipantInfo.of([UserId('1')], 2),
      });

      shareDealQueryRepositoryPort.findById.mockReturnValue(
        T.succeed(shareDeal),
      );
      shareDealRepositoryPort.save.mockReturnValue(T.succeed(shareDeal));

      // when
      const result = shareDealCommandService.start(command);

      // then
      await assertResolvesSuccess(result, () => {
        expect(shareDeal.status).toBe(ShareDealStatus.START);
      });
    });

    it('OPEN 상태가 아닌 경우 시작할 수 없다', async () => {
      // given
      const command = new StartShareDealCommand(
        UserId('userId'),
        ShareDealId('shareDealId'),
      );
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.END,
      });

      shareDealQueryRepositoryPort.findById.mockReturnValue(
        T.succeed(shareDeal),
      );

      // when
      const result = shareDealCommandService.start(command);

      // then
      await assertResolvesFail(result, (error) => {
        expect(error).toBeInstanceOf(IllegalStateException);
      });
    });
  });

  describe('end', () => {
    it('방장은 공유딜을 종료할 수 있다', async () => {
      // given
      const command = new EndShareDealCommand(
        UserId('userId'),
        ShareDealId('shareDealId'),
      );
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.START,
        ownerId: command.userId,
        participantInfo: ParticipantInfo.of([UserId('1')], 2),
      });

      shareDealQueryRepositoryPort.findById.mockReturnValue(
        T.succeed(shareDeal),
      );
      shareDealRepositoryPort.save.mockReturnValue(T.succeed(shareDeal));

      // when
      const result = shareDealCommandService.end(command);

      // then
      await assertResolvesSuccess(result, () => {
        expect(shareDeal.status).toBe(ShareDealStatus.END);
      });
    });

    it('START 상태가 아닌 경우 종료할 수 없다', async () => {
      // given
      const command = new EndShareDealCommand(
        UserId('userId'),
        ShareDealId('shareDealId'),
      );
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.END,
      });

      shareDealQueryRepositoryPort.findById.mockReturnValue(
        T.succeed(shareDeal),
      );

      // when
      const result = shareDealCommandService.end(command);

      // then
      await assertResolvesFail(result, (error) => {
        expect(error).toBeInstanceOf(IllegalStateException);
      });
    });
  });

  describe('update', () => {
    it('공유딜 수정을 수행한다.', async () => {
      // given
      const ownerId = UserId('ownerId');
      const shareDeal = ShareDealFactory.createOpen({
        ownerId,
      });
      const command = new UpdateShareDealCommand(
        ownerId,
        ShareDealId('shareDealId'),
        'title',
        FoodCategory.AMERICAN,
        10,
        1000,
        'store',
        'thumbnail',
        AddressSystem.ROAD,
        'road',
        'detail',
        123,
        45,
      );

      shareDealQueryRepositoryPort.findById.mockReturnValue(
        T.succeed(shareDeal),
      );
      shareDealRepositoryPort.save.mockReturnValue(T.succeed(shareDeal));

      // when
      const result = shareDealCommandService.update(command);

      // then
      await assertResolvesSuccess(result, () => {
        expect(shareDeal.title).toBe(command.title);
        expect(shareDeal.zone.path).toBe(command.addressPath);
        expect(shareDeal.zone.detail).toBe(command.addressDetail);
        expect(shareDeal.zone.coordinate.latitude).toBe(command.latitude);
        expect(shareDeal.zone.coordinate.longitude).toBe(command.longitude);
        expect(shareDeal.thumbnail).toBe(command.thumbnail);
        expect(shareDeal.storeName).toBe(command.storeName);
        expect(shareDeal.participantInfo.max).toBe(command.maxParticipants);
      });
    });
  });

  describe('leave', () => {
    it('참가자는 공유딜을 떠날 수 있다.', async () => {
      // given
      const command = new LeaveShareDealCommand(
        UserId('userId'),
        ShareDealId('shareDealId'),
      );
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.READY,
        ownerId: UserId('ownerId'),
        participantInfo: ParticipantInfo.of([command.userId], 2),
      });

      shareDealQueryRepositoryPort.findById.mockReturnValue(
        T.succeed(shareDeal),
      );
      shareDealRepositoryPort.save.mockReturnValue(T.succeed(shareDeal));

      // when
      const result = shareDealCommandService.leave(command);

      // then
      await assertResolvesSuccess(result, () => {
        expect(shareDeal.participantInfo.hasId(command.userId)).toBe(false);
      });
    });

    it('참가자가 아니면 에러를 반환한다', async () => {
      // given
      const command = new EndShareDealCommand(
        UserId('userId'),
        ShareDealId('shareDealId'),
      );
      const shareDeal = ShareDealFactory.create({
        participantInfo: ParticipantInfo.of([UserId('user1')], 2),
      });

      shareDealQueryRepositoryPort.findById.mockReturnValue(
        T.succeed(shareDeal),
      );

      // when
      const result = shareDealCommandService.end(command);

      // then
      await assertResolvesFail(result, (error) => {
        expect(error).toBeInstanceOf(IllegalStateException);
      });
    });
  });
});
