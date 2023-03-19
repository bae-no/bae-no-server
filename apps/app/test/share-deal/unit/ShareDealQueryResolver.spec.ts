import { T } from '@app/custom/effect';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { mock, mockReset } from 'vitest-mock-extended';

import { FindShareDealByNearestInput } from '../../../src/module/share-deal/adapter/in/gql/input/FindShareDealByNearestInput';
import { FindShareDealInput } from '../../../src/module/share-deal/adapter/in/gql/input/FindShareDealInput';
import { FindShareDealStatusInput } from '../../../src/module/share-deal/adapter/in/gql/input/FindShareDealStatusInput';
import { ShareDealQueryResolver } from '../../../src/module/share-deal/adapter/in/gql/ShareDealQueryResolver';
import { ShareDealSortType } from '../../../src/module/share-deal/application/port/out/dto/ShareDealSortType';
import { ShareDealQueryRepositoryPort } from '../../../src/module/share-deal/application/port/out/ShareDealQueryRepositoryPort';
import { ShareDealId } from '../../../src/module/share-deal/domain/ShareDeal';
import { FoodCategory } from '../../../src/module/share-deal/domain/vo/FoodCategory';
import { ParticipantInfo } from '../../../src/module/share-deal/domain/vo/ParticipantInfo';
import { ShareZone } from '../../../src/module/share-deal/domain/vo/ShareZone';
import { UserQueryRepositoryPort } from '../../../src/module/user/application/port/out/UserQueryRepositoryPort';
import { UserId } from '../../../src/module/user/domain/User';
import { Address } from '../../../src/module/user/domain/vo/Address';
import { AddressSystem } from '../../../src/module/user/domain/vo/AddressSystem';
import { AddressType } from '../../../src/module/user/domain/vo/AddressType';
import { UserAddressList } from '../../../src/module/user/domain/vo/UserAddressList';
import {
  graphQLTestHelper,
  setMockUser,
} from '../../fixture/graphqlTestHelper';
import { ShareDealFactory } from '../../fixture/ShareDealFactory';
import { UserFactory } from '../../fixture/UserFactory';
import { gql } from '../../fixture/utils';

describe('ShareDealQueryResolver', () => {
  const shareDealQueryRepositoryPort = mock<ShareDealQueryRepositoryPort>();
  const userQueryRepositoryPort = mock<UserQueryRepositoryPort>();
  let app: INestApplication;

  beforeAll(async () => {
    app = await graphQLTestHelper({
      providers: [
        ShareDealQueryResolver,
        {
          provide: ShareDealQueryRepositoryPort,
          useValue: shareDealQueryRepositoryPort,
        },
        {
          provide: UserQueryRepositoryPort,
          useValue: userQueryRepositoryPort,
        },
      ],
    });
    setMockUser();
  });

  afterAll(async () => app.close());

  beforeEach(() => {
    mockReset(shareDealQueryRepositoryPort);
    mockReset(userQueryRepositoryPort);
  });

  describe('shareDeals', () => {
    it('공유딜 목록을 조회한다', async () => {
      // given
      const input = new FindShareDealInput();
      input.page = 1;
      input.size = 10;
      input.sortType = ShareDealSortType.LATEST;

      const query = gql`
        query shareDeals($input: FindShareDealInput!) {
          shareDeals(input: $input) {
            items {
              id
              createdAt
              title
              orderPrice
              maxParticipants
              currentParticipants
              status
              thumbnail
              category
              coordinate {
                latitude
                longitude
              }
            }
            total
          }
        }
      `;

      const shareDeal = ShareDealFactory.createOpen({
        id: ShareDealId('12345'),
        orderPrice: 1000,
        title: 'title',
        createdAt: new Date('2022-01-01'),
        thumbnail: 'thumbnail',
        participantInfo: ParticipantInfo.of(['1', '2', '3'].map(UserId), 10),
        category: FoodCategory.CHINESE,
        zone: new ShareZone(AddressSystem.ROAD, 'road', 'detail', 123.5, 45.6),
      });

      shareDealQueryRepositoryPort.find.mockReturnValue(T.succeed([shareDeal]));
      shareDealQueryRepositoryPort.count.mockReturnValue(T.succeed(10));

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "shareDeals": {
              "items": [
                {
                  "category": "CHINESE",
                  "coordinate": {
                    "latitude": 123.5,
                    "longitude": 45.6,
                  },
                  "createdAt": "2022-01-01T00:00:00.000Z",
                  "currentParticipants": 3,
                  "id": "12345",
                  "maxParticipants": 10,
                  "orderPrice": 1000,
                  "status": "OPEN",
                  "thumbnail": "thumbnail",
                  "title": "title",
                },
              ],
              "total": 10,
            },
          },
        }
      `);
    });
  });

  describe('shareDealsByNearest', () => {
    it('공유딜 목록을 조회한다', async () => {
      // given
      const input = new FindShareDealByNearestInput();
      input.page = 1;
      input.size = 10;
      input.addressKey = 0;

      const query = gql`
        query shareDealsByNearest($input: FindShareDealByNearestInput!) {
          shareDealsByNearest(input: $input) {
            items {
              id
              createdAt
              title
              orderPrice
              maxParticipants
              currentParticipants
              status
              thumbnail
              category
              coordinate {
                latitude
                longitude
              }
            }
            total
          }
        }
      `;

      const user = UserFactory.create({
        addressList: UserAddressList.of([
          new Address(
            'a',
            AddressSystem.JIBUN,
            'b',
            'c',
            AddressType.ETC,
            1,
            1,
          ),
        ]),
      });
      const shareDeal = ShareDealFactory.createOpen({
        id: ShareDealId('12345'),
        orderPrice: 1000,
        title: 'title',
        createdAt: new Date('2022-01-01'),
        thumbnail: 'thumbnail',
        participantInfo: ParticipantInfo.of(['1', '2', '3'].map(UserId), 10),
        category: FoodCategory.CHINESE,
        zone: new ShareZone(AddressSystem.JIBUN, 'road', 'detail', 123.5, 45.6),
      });

      userQueryRepositoryPort.findById.mockReturnValue(T.succeed(user));
      shareDealQueryRepositoryPort.findByNearest.mockReturnValue(
        T.succeed([shareDeal]),
      );
      shareDealQueryRepositoryPort.count.mockReturnValue(T.succeed(10));

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "shareDealsByNearest": {
              "items": [
                {
                  "category": "CHINESE",
                  "coordinate": {
                    "latitude": 123.5,
                    "longitude": 45.6,
                  },
                  "createdAt": "2022-01-01T00:00:00.000Z",
                  "currentParticipants": 3,
                  "id": "12345",
                  "maxParticipants": 10,
                  "orderPrice": 1000,
                  "status": "OPEN",
                  "thumbnail": "thumbnail",
                  "title": "title",
                },
              ],
              "total": 10,
            },
          },
        }
      `);
    });
  });

  describe('myEndDealCount', () => {
    it('내가 참여완료한 공유딜 개수를 가져온다 ', async () => {
      // given
      const query = gql`
        query myEndDealCount {
          myEndDealCount
        }
      `;
      shareDealQueryRepositoryPort.countByStatus.mockReturnValue(T.succeed(10));

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

  describe('shareDealStatus', () => {
    it('내가 참여하는 공유딜 상태를 가져온다 ', async () => {
      // given
      const input = new FindShareDealStatusInput();
      input.shareDealId = ShareDealId('12345');

      const query = gql`
        query shareDealStatus($input: FindShareDealStatusInput!) {
          shareDealStatus(input: $input) {
            canStart
            canEnd
            isOwner
            participants {
              id
              nickname
              isOwner
              isMe
            }
          }
        }
      `;

      const owner = UserFactory.create({
        id: UserId('ownerId'),
        nickname: 'owner name',
      });
      const participant = UserFactory.create({
        id: UserId('participantId'),
        nickname: 'participant name',
      });
      setMockUser(owner.id);

      const shareDeal = ShareDealFactory.createOpen({
        ownerId: owner.id,
        participantInfo: ParticipantInfo.of([owner.id, participant.id], 2),
      });

      shareDealQueryRepositoryPort.findById.mockReturnValue(
        T.succeed(shareDeal),
      );
      userQueryRepositoryPort.findByIds.mockReturnValue(
        T.succeed([owner, participant]),
      );

      // then
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query, variables: { input } });

      // when
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "shareDealStatus": {
              "canEnd": false,
              "canStart": true,
              "isOwner": true,
              "participants": [
                {
                  "id": "ownerId",
                  "isMe": true,
                  "isOwner": true,
                  "nickname": "owner name",
                },
                {
                  "id": "participantId",
                  "isMe": false,
                  "isOwner": false,
                  "nickname": "participant name",
                },
              ],
            },
          },
        }
      `);
    });
  });
});
