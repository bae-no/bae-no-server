import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';

import { OpenShareDealCommand } from '../../../src/module/share-deal/application/port/in/dto/OpenShareDealCommand';
import { ShareDealRepositoryPort } from '../../../src/module/share-deal/application/port/out/ShareDealRepositoryPort';
import { ShareDealCommandService } from '../../../src/module/share-deal/application/service/ShareDealCommandService';
import { FoodCategory } from '../../../src/module/share-deal/domain/vo/FoodCategory';
import { assertResolvesRight } from '../../fixture';

describe('ShareDealCommandService', () => {
  const shareDealRepositoryPort = mock<ShareDealRepositoryPort>();
  const shareDealCommandService = new ShareDealCommandService(
    shareDealRepositoryPort,
  );

  beforeEach(() => {
    mockReset(shareDealRepositoryPort);
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
});
