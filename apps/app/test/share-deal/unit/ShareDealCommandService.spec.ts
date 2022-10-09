import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';

import { JoinShareDealCommand } from '../../../src/module/share-deal/application/port/in/dto/JoinShareDealCommand';
import { OpenShareDealCommand } from '../../../src/module/share-deal/application/port/in/dto/OpenShareDealCommand';
import { NotJoinableShareDealException } from '../../../src/module/share-deal/application/port/in/exception/NotJoinableShareDealException';
import { ShareDealQueryRepositoryPort } from '../../../src/module/share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { ShareDealRepositoryPort } from '../../../src/module/share-deal/application/port/out/ShareDealRepositoryPort';
import { ShareDealCommandService } from '../../../src/module/share-deal/application/service/ShareDealCommandService';
import { FoodCategory } from '../../../src/module/share-deal/domain/vo/FoodCategory';
import { ShareDealStatus } from '../../../src/module/share-deal/domain/vo/ShareDealStatus';
import { assertResolvesLeft, assertResolvesRight } from '../../fixture';
import { ShareDealFactory } from '../../fixture/ShareDealFactory';

describe('ShareDealCommandService', () => {
  const shareDealRepositoryPort = mock<ShareDealRepositoryPort>();
  const shareDealQueryRepositoryPort = mock<ShareDealQueryRepositoryPort>();
  const shareDealCommandService = new ShareDealCommandService(
    shareDealRepositoryPort,
    shareDealQueryRepositoryPort,
  );

  beforeEach(() => {
    mockReset(shareDealRepositoryPort);
    mockReset(shareDealQueryRepositoryPort);
  });

  describe('open', () => {
    it('공유딜 생성 요청을 수행한다.', async () => {
      // given
      const command = new OpenShareDealCommand(
        'userId',
        'title',
        FoodCategory.AMERICAN,
        10,
        1000,
        'store',
        'thumbnail',
        'road',
        'detail',
        123,
        45,
      );

      shareDealRepositoryPort.save.mockReturnValue(right(command.toDomain()));

      // when
      const result = shareDealCommandService.open(command);

      // then
      await assertResolvesRight(result);
    });
  });

  describe('join', () => {
    it('채팅 참여가 불가능한 공유딜에 참여 요청할 경우 NotOpenShareDealException이 반환된다.', async () => {
      // given
      const command = new JoinShareDealCommand('userId', 'shareDealId');
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.START,
      });

      shareDealQueryRepositoryPort.findById.mockReturnValue(right(shareDeal));

      // when
      const result = shareDealCommandService.join(command);

      // then
      await assertResolvesLeft(result, (value) => {
        expect(value).toBeInstanceOf(NotJoinableShareDealException);
      });
    });

    it('공유딜 채팅방 참여를 요청한다.', async () => {
      // given
      const command = new JoinShareDealCommand('userId', 'shareDealId');
      const shareDeal = ShareDealFactory.create({
        status: ShareDealStatus.OPEN,
      });

      shareDealQueryRepositoryPort.findById.mockReturnValue(right(shareDeal));
      shareDealRepositoryPort.save.mockReturnValue(right(shareDeal));

      // when
      const result = shareDealCommandService.join(command);

      // then
      await assertResolvesRight(result, () => {
        expect(shareDeal.participantInfo.hasId(command.userId)).toBe(true);
      });
    });
  });
});
