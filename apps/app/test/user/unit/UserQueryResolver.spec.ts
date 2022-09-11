import { INestApplication } from '@nestjs/common';
import { none } from 'fp-ts/Option';
import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';
import * as request from 'supertest';

import { UserQueryResolver } from '../../../src/module/user/adapter/in/gql/UserQueryResolver';
import { UserQueryRepositoryPort } from '../../../src/module/user/application/port/out/UserQueryRepositoryPort';
import {
  graphQLTestHelper,
  setMockUser,
} from '../../fixture/graphqlTestHelper';

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
    it('', async () => {
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
});
