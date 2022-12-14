import { INestApplication } from '@nestjs/common';
import { none } from 'fp-ts/Option';
import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';
import * as request from 'supertest';

import { UserQueryResolver } from '../../../src/module/user/adapter/in/gql/UserQueryResolver';
import { UserQueryRepositoryPort } from '../../../src/module/user/application/port/out/UserQueryRepositoryPort';
import { User } from '../../../src/module/user/domain/User';
import { Address } from '../../../src/module/user/domain/vo/Address';
import { AddressSystem } from '../../../src/module/user/domain/vo/AddressSystem';
import { AddressType } from '../../../src/module/user/domain/vo/AddressType';
import { Auth } from '../../../src/module/user/domain/vo/Auth';
import { AuthType } from '../../../src/module/user/domain/vo/AuthType';
import { Profile } from '../../../src/module/user/domain/vo/Profile';
import {
  graphQLTestHelper,
  setMockUser,
} from '../../fixture/graphqlTestHelper';
import { UserFactory } from '../../fixture/UserFactory';
import { gql } from '../../fixture/utils';

describe('UserQueryResolver', () => {
  const userQueryRepositoryPort = mock<UserQueryRepositoryPort>();
  let app: INestApplication;

  beforeAll(async () => {
    app = await graphQLTestHelper({
      providers: [
        UserQueryResolver,
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
    mockReset(userQueryRepositoryPort);
  });

  describe('hasNickname', () => {
    it('닉네임 중복여부 확인에 성공한다', async () => {
      // given
      const query = gql`
        query hasNickname {
          hasNickname(nickname: "nickname")
        }
      `;

      userQueryRepositoryPort.findByNickname.mockReturnValue(right(none));

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "hasNickname": false,
          },
        }
      `);
    });
  });

  describe('addresses', () => {
    it('사용자 주소 목록을 가져온다', async () => {
      // given
      const query = gql`
        query addresses {
          addresses {
            key
            alias
            system
            path
            detail
            type
            coordinate {
              latitude
              longitude
            }
          }
        }
      `;
      const auth = new Auth('socialId', AuthType.GOOGLE);
      const user = User.byAuth(auth);
      user.enroll(
        'nickname',
        new Address(
          'alias',
          AddressSystem.ROAD,
          'path',
          'detail',
          AddressType.ETC,
          1,
          2,
        ),
      );

      userQueryRepositoryPort.findById.mockReturnValue(right(user));

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "addresses": [
              {
                "alias": "alias",
                "coordinate": {
                  "latitude": 1,
                  "longitude": 2,
                },
                "detail": "detail",
                "key": "0",
                "path": "path",
                "system": "ROAD",
                "type": "ETC",
              },
            ],
          },
        }
      `);
    });
  });

  describe('myProfile', () => {
    it('내 프로필 정보를 조회한다.', async () => {
      // given
      const query = gql`
        query myProfile {
          myProfile {
            nickname
            phoneNumber
            imageUri
            introduce
          }
        }
      `;

      const user = UserFactory.create({
        nickname: 'nickname',
        phoneNumber: '01011112222',
        profile: new Profile('uri', 'introduce'),
      });

      userQueryRepositoryPort.findById.mockReturnValue(right(user));

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "myProfile": {
              "imageUri": "uri",
              "introduce": "introduce",
              "nickname": "nickname",
              "phoneNumber": "01011112222",
            },
          },
        }
      `);
    });
  });

  describe('profile', () => {
    it('사용자 프로필 정보를 조회한다.', async () => {
      // given
      const query = gql`
        query profile($userId: ID!) {
          profile(userId: $userId) {
            nickname
            introduce
          }
        }
      `;

      const user = UserFactory.create({
        nickname: 'nickname',
        profile: new Profile('userId', 'introduce'),
      });

      userQueryRepositoryPort.findById.mockReturnValue(right(user));

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query, variables: { userId: user.id } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "profile": {
              "introduce": "introduce",
              "nickname": "nickname",
            },
          },
        }
      `);
    });
  });
});
