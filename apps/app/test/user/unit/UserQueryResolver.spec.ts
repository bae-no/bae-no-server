import { INestApplication } from '@nestjs/common';
import { none } from 'fp-ts/Option';
import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';
import * as request from 'supertest';

import { UserQueryResolver } from '../../../src/module/user/adapter/in/gql/UserQueryResolver';
import { UserQueryRepositoryPort } from '../../../src/module/user/application/port/out/UserQueryRepositoryPort';
import { User } from '../../../src/module/user/domain/User';
import { Address } from '../../../src/module/user/domain/vo/Address';
import { AddressType } from '../../../src/module/user/domain/vo/AddressType';
import { Auth } from '../../../src/module/user/domain/vo/Auth';
import { AuthType } from '../../../src/module/user/domain/vo/AuthType';
import { Profile } from '../../../src/module/user/domain/vo/Profile';
import {
  graphQLTestHelper,
  setMockUser,
} from '../../fixture/graphqlTestHelper';
import { UserFactory } from '../../fixture/UserFactory';

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
      // language=GraphQL
      const query = `query hasNickname {
        hasNickname(nickname: "nickname")
      }`;

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
      // language=GraphQL
      const query = `query addresses {
        addresses {
          key
          alias
          road
          detail
          type
          coordinate {
            latitude
            longitude
          }
        }
      }`;
      const auth = new Auth('socialId', AuthType.GOOGLE);
      const user = User.byAuth(auth);
      user.enroll(
        'nickname',
        new Address('alias', 'road', 'detail', AddressType.ETC, 1, 2),
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
                "road": "road",
                "type": "ETC",
              },
            ],
          },
        }
      `);
    });
  });

  describe('profile', () => {
    it('사용자 프로필 정보를 조회한다.', async () => {
      // given
      // language=GraphQL
      const query = `query profile {
        profile {
          nickname
          phoneNumber
          imageUri
          introduce
        }
      }`;

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
            "profile": {
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
});
