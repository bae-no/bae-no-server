import { INestApplication } from '@nestjs/common';
import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';
import * as request from 'supertest';

import { FindShareDealInput } from '../../../src/module/share-deal/adapter/in/gql/input/FindShareDealInput';
import { ShareDealQueryResolver } from '../../../src/module/share-deal/adapter/in/gql/ShareDealQueryResolver';
import { ShareDealSortType } from '../../../src/module/share-deal/application/port/out/dto/ShareDealSortType';
import { ShareDealQueryRepositoryPort } from '../../../src/module/share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { FoodCategory } from '../../../src/module/share-deal/domain/vo/FoodCategory';
import { ParticipantInfo } from '../../../src/module/share-deal/domain/vo/ParticipantInfo';
import {
  graphQLTestHelper,
  setMockUser,
} from '../../fixture/graphqlTestHelper';
import { ShareDealFactory } from '../../fixture/ShareDealFactory';

describe('ShareDealQueryResolver', () => {
  const shareDealQueryRepositoryPort = mock<ShareDealQueryRepositoryPort>();
  let app: INestApplication;

  beforeAll(async () => {
    app = await graphQLTestHelper({
      providers: [
        ShareDealQueryResolver,
        {
          provide: ShareDealQueryRepositoryPort,
          useValue: shareDealQueryRepositoryPort,
        },
      ],
    });
    setMockUser();
  });

  afterAll(async () => app.close());

  beforeEach(() => {
    mockReset(shareDealQueryRepositoryPort);
  });

  describe('shareDeals', () => {
    it('공유딜 목록을 조회한다', async () => {
      // given
      const input = new FindShareDealInput();
      input.page = 1;
      input.size = 10;
      input.sortType = ShareDealSortType.LATEST;

      // language=GraphQL
      const query = `query shareDeals($input: FindShareDealInput!) {
        shareDeals(input: $input) {
          id
          createdAt
          title
          distance
          orderPrice
          minParticipants
          currentParticipants
          status
          thumbnail
          category
        }
      }`;

      const shareDeal = ShareDealFactory.createOpen({
        id: '12345',
        orderPrice: 1000,
        title: 'title',
        createdAt: new Date('2022-01-01'),
        thumbnail: 'thumbnail',
        participantInfo: ParticipantInfo.of(['1', '2', '3'], 10),
        category: FoodCategory.CHINESE,
      });

      shareDealQueryRepositoryPort.find.mockReturnValue(right([shareDeal]));

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "shareDeals": [
              {
                "category": "CHINESE",
                "createdAt": "2022-01-01T00:00:00.000Z",
                "currentParticipants": 3,
                "distance": 0,
                "id": "12345",
                "minParticipants": 10,
                "orderPrice": 1000,
                "status": "OPEN",
                "thumbnail": "thumbnail",
                "title": "title",
              },
            ],
          },
        }
      `);
    });
  });

  describe('myEndDealCount', () => {
    it('내가 참여완료한 공유딜 개수를 가져온다 ', async () => {
      // given
      // language=GraphQL
      const query = `query myEndDealCount {
        myEndDealCount
      }`;
      shareDealQueryRepositoryPort.countByStatus.mockReturnValue(right(10));

      // then
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query });

      // when
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "myEndDealCount": 10,
          },
        }
      `);
    });
  });
});
