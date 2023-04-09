import { T } from '@app/custom/effect';
import { IllegalStateException } from '@app/domain/exception/IllegalStateException';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { mock, mockReset } from 'vitest-mock-extended';

import { CreateShareZoneInput } from '../../../src/module/share-deal/adapter/in/gql/input/CreateShareZoneInput';
import { EndShareDealInput } from '../../../src/module/share-deal/adapter/in/gql/input/EndShareDealInput';
import { JoinShareDealInput } from '../../../src/module/share-deal/adapter/in/gql/input/JoinShareDealInput';
import { LeaveShareDealInput } from '../../../src/module/share-deal/adapter/in/gql/input/LeaveShareDealInput';
import { OpenShareDealInput } from '../../../src/module/share-deal/adapter/in/gql/input/OpenShareDealInput';
import { StartShareDealInput } from '../../../src/module/share-deal/adapter/in/gql/input/StartShareDealInput';
import { UpdateShareDealInput } from '../../../src/module/share-deal/adapter/in/gql/input/UpdateShareDealInput';
import { ShareDealMutationResolver } from '../../../src/module/share-deal/adapter/in/gql/ShareDealMutationResolver';
import { NotJoinableShareDealException } from '../../../src/module/share-deal/application/port/in/exception/NotJoinableShareDealException';
import { ShareDealCommandUseCase } from '../../../src/module/share-deal/application/port/in/ShareDealCommandUseCase';
import { ShareDealId } from '../../../src/module/share-deal/domain/ShareDeal';
import { FoodCategory } from '../../../src/module/share-deal/domain/vo/FoodCategory';
import { AddressSystem } from '../../../src/module/user/domain/vo/AddressSystem';
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
      input.maxParticipants = 2;
      input.storeName = 'IPPPPPPPPPAAZ';
      input.orderPrice = 1000;
      input.thumbnail = 'thumbnail';

      const shareZoneInput = new CreateShareZoneInput();
      shareZoneInput.addressSystem = AddressSystem.ROAD;
      shareZoneInput.addressDetail = 'detail';
      shareZoneInput.addressPath = 'road';
      shareZoneInput.longitude = 100;
      shareZoneInput.latitude = 50;
      input.shareZone = shareZoneInput;

      const mutation = gql`
        mutation openShareDeal($input: OpenShareDealInput!) {
          openShareDeal(input: $input) {
            shareDealId
          }
        }
      `;

      sharedDealCommandUseCase.open.mockReturnValue(
        T.succeed(ShareDealId('shareDealId')),
      );

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "openShareDeal": {
              "shareDealId": "shareDealId",
            },
          },
        }
      `);
    });
  });

  describe('joinShareDeal', () => {
    it('공유딜 참여 실패 시 ILLEGAL_STATE를 반환한다.', async () => {
      // given
      const input = new JoinShareDealInput();
      input.shareDealId = ShareDealId('abcd1234');

      const mutation = gql`
        mutation joinShareDeal($input: JoinShareDealInput!) {
          joinShareDeal(input: $input)
        }
      `;

      sharedDealCommandUseCase.join.mockReturnValue(
        T.fail(new NotJoinableShareDealException('error')),
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
      input.shareDealId = ShareDealId('abcd1234');

      const mutation = gql`
        mutation joinShareDeal($input: JoinShareDealInput!) {
          joinShareDeal(input: $input)
        }
      `;

      sharedDealCommandUseCase.join.mockReturnValue(T.unit);

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
      input.shareDealId = ShareDealId('abcd1234');

      const mutation = gql`
        mutation startShareDeal($input: StartShareDealInput!) {
          startShareDeal(input: $input)
        }
      `;

      sharedDealCommandUseCase.start.mockReturnValue(T.unit);

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
      input.shareDealId = ShareDealId('abcd1234');

      const mutation = gql`
        mutation startShareDeal($input: StartShareDealInput!) {
          startShareDeal(input: $input)
        }
      `;

      sharedDealCommandUseCase.start.mockReturnValue(
        T.fail(new IllegalStateException('error')),
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

  describe('endShareDeal', () => {
    it('공유딜을 종료한다.', async () => {
      // given
      const input = new EndShareDealInput();
      input.shareDealId = ShareDealId('abcd1234');

      const mutation = gql`
        mutation endShareDeal($input: EndShareDealInput!) {
          endShareDeal(input: $input)
        }
      `;

      sharedDealCommandUseCase.end.mockReturnValue(T.unit);

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "endShareDeal": true,
          },
        }
      `);
    });

    it('유효하지 않은 상태의 공유딜을 종료할 경우 예외를 반환한다.', async () => {
      // given
      const input = new EndShareDealInput();
      input.shareDealId = ShareDealId('abcd1234');

      const mutation = gql`
        mutation endShareDeal($input: EndShareDealInput!) {
          endShareDeal(input: $input)
        }
      `;

      sharedDealCommandUseCase.end.mockReturnValue(
        T.fail(new IllegalStateException('error')),
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
                "endShareDeal",
              ],
            },
          ],
        }
      `);
    });
  });

  describe('updateShareDeal', () => {
    it('공유딜을 수정한다.', async () => {
      // given
      const input = new UpdateShareDealInput();
      input.id = 'shareDealId';
      input.title = 'PIIIIIIIIZZA';
      input.category = FoodCategory.BURGER;
      input.maxParticipant = 2;
      input.storeName = 'IPPPPPPPPPAAZ';
      input.orderPrice = 1000;
      input.thumbnail = 'thumbnail';

      const shareZoneInput = new CreateShareZoneInput();
      shareZoneInput.addressSystem = AddressSystem.JIBUN;
      shareZoneInput.addressDetail = 'detail';
      shareZoneInput.addressPath = 'road';
      shareZoneInput.longitude = 100;
      shareZoneInput.latitude = 50;
      input.shareZone = shareZoneInput;

      const mutation = gql`
        mutation updateShareDeal($input: UpdateShareDealInput!) {
          updateShareDeal(input: $input)
        }
      `;

      sharedDealCommandUseCase.update.mockReturnValue(T.unit);

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "updateShareDeal": true,
          },
        }
      `);
    });
  });

  describe('leaveShareDeal', () => {
    it('공유딜을 떠난다.', async () => {
      // given
      const input = new LeaveShareDealInput();
      input.shareDealId = ShareDealId('abcd1234');

      const mutation = gql`
        mutation leaveShareDeal($input: LeaveShareDealInput!) {
          leaveShareDeal(input: $input)
        }
      `;

      sharedDealCommandUseCase.leave.mockReturnValue(T.unit);

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "leaveShareDeal": true,
          },
        }
      `);
    });
  });
});
