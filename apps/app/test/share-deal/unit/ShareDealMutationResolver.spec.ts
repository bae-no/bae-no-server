import { IllegalStateException } from '@app/domain/exception/IllegalStateException';
import { INestApplication } from '@nestjs/common';
import { left, right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';
import * as request from 'supertest';

import { CreateShareZoneInput } from '../../../src/module/share-deal/adapter/in/gql/input/CreateShareZoneInput';
import { JoinShareDealInput } from '../../../src/module/share-deal/adapter/in/gql/input/JoinShareDealInput';
import { OpenShareDealInput } from '../../../src/module/share-deal/adapter/in/gql/input/OpenShareDealInput';
import { StartShareDealInput } from '../../../src/module/share-deal/adapter/in/gql/input/StartShareDealInput';
import { ShareDealMutationResolver } from '../../../src/module/share-deal/adapter/in/gql/ShareDealMutationResolver';
import { NotJoinableShareDealException } from '../../../src/module/share-deal/application/port/in/exception/NotJoinableShareDealException';
import { ShareDealCommandUseCase } from '../../../src/module/share-deal/application/port/in/ShareDealCommandUseCase';
import { FoodCategory } from '../../../src/module/share-deal/domain/vo/FoodCategory';
import {
  graphQLTestHelper,
  setMockUser,
} from '../../fixture/graphqlTestHelper';
import { gql } from '../../fixture/utils';

describe('ShareDealMutationResolver', () => {
  const sharedDealCommandUseCase = mock<ShareDealCommandUseCase>();
  let app: INestApplication;

  beforeAll(async () => {
    app = await graphQLTestHelper({
      providers: [
        ShareDealMutationResolver,
        {
          provide: ShareDealCommandUseCase,
          useValue: sharedDealCommandUseCase,
        },
      ],
    });
    setMockUser();
  });

  afterAll(async () => app.close());

  beforeEach(() => mockReset(sharedDealCommandUseCase));

  describe('openShareDeal', () => {
    it('공유딜을 생성한다.', async () => {
      // given
      const input = new OpenShareDealInput();
      input.title = 'PIIIIIIIIZZA';
      input.category = FoodCategory.BURGER;
      input.minParticipants = 2;
      input.storeName = 'IPPPPPPPPPAAZ';
      input.orderPrice = 1000;
      input.thumbnail = 'thumbnail';

      const shareZoneInput = new CreateShareZoneInput();
      shareZoneInput.addressDetail = 'detail';
      shareZoneInput.addressRoad = 'road';
      shareZoneInput.longitude = 100;
      shareZoneInput.latitude = 50;
      input.shareZone = shareZoneInput;

      const mutation = gql`
        mutation openShareDeal($input: OpenShareDealInput!) {
          openShareDeal(input: $input)
        }
      `;

      sharedDealCommandUseCase.open.mockReturnValue(right(undefined));

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "openShareDeal": true,
          },
        }
      `);
    });
  });

  describe('joinShareDeal', () => {
    it('공유딜 참여 실패 시 ILLEGAL_STATE를 반환한다.', async () => {
      // given
      const input = new JoinShareDealInput();
      input.shareDealId = 'abcd1234';

      const mutation = gql`
        mutation joinShareDeal($input: JoinShareDealInput!) {
          joinShareDeal(input: $input)
        }
      `;

      sharedDealCommandUseCase.join.mockReturnValue(
        left(new NotJoinableShareDealException('error')),
      );

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": null,
          "errors": [
            {
              "extensions": {
                "code": "ILLEGAL_STATE",
              },
              "locations": [
                {
                  "column": 11,
                  "line": 3,
                },
              ],
              "message": "error",
              "path": [
                "joinShareDeal",
              ],
            },
          ],
        }
      `);
    });

    it('공유딜에 참여한다.', async () => {
      // given
      const input = new JoinShareDealInput();
      input.shareDealId = 'abcd1234';

      const mutation = gql`
        mutation joinShareDeal($input: JoinShareDealInput!) {
          joinShareDeal(input: $input)
        }
      `;

      sharedDealCommandUseCase.join.mockReturnValue(right(undefined));

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "joinShareDeal": true,
          },
        }
      `);
    });
  });

  describe('startShareDeal', () => {
    it('공유딜을 시작한다.', async () => {
      // given
      const input = new StartShareDealInput();
      input.shareDealId = 'abcd1234';

      const mutation = gql`
        mutation startShareDeal($input: StartShareDealInput!) {
          startShareDeal(input: $input)
        }
      `;

      sharedDealCommandUseCase.start.mockReturnValue(right(undefined));

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "startShareDeal": true,
          },
        }
      `);
    });

    it('유효하지 않은 상태의 공유딜을 시작할 경우 예외를 반환한다.', async () => {
      // given
      const input = new StartShareDealInput();
      input.shareDealId = 'abcd1234';

      const mutation = gql`
        mutation startShareDeal($input: StartShareDealInput!) {
          startShareDeal(input: $input)
        }
      `;

      sharedDealCommandUseCase.start.mockReturnValue(
        left(new IllegalStateException('error')),
      );

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": null,
          "errors": [
            {
              "extensions": {
                "code": "ILLEGAL_STATE",
              },
              "locations": [
                {
                  "column": 11,
                  "line": 3,
                },
              ],
              "message": "error",
              "path": [
                "startShareDeal",
              ],
            },
          ],
        }
      `);
    });
  });
});
