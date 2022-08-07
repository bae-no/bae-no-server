import { INestApplication } from '@nestjs/common';
import { right } from 'fp-ts/TaskEither';
import { mock } from 'jest-mock-extended';
import * as request from 'supertest';

import { SignInInput } from '../../../src/module/user/adapter/in/gql/input/SignInInput';
import { UserMutationResolver } from '../../../src/module/user/adapter/in/gql/UserMutationResolver';
import { AuthToken } from '../../../src/module/user/application/port/in/AuthToken';
import { UserCommandUseCase } from '../../../src/module/user/application/port/in/UserCommandUseCase';
import { AuthType } from '../../../src/module/user/domain/vo/AuthType';
import { graphQLTestHelper } from '../../fixture/graphqlTestHelper';

describe('UserMutationResolver', () => {
  const userCommandUseCase = mock<UserCommandUseCase>();
  let app: INestApplication;

  beforeAll(async () => {
    app = await graphQLTestHelper({
      providers: [
        UserMutationResolver,
        {
          provide: UserCommandUseCase,
          useValue: userCommandUseCase,
        },
      ],
    });
  });

  afterAll(async () => app.close());

  describe('signIn', () => {
    it('로그인 요청에 성공한다', async () => {
      // given
      const input = new SignInInput();
      input.code = 'code';
      input.type = AuthType.APPLE;

      // language=GraphQL
      const mutation = `mutation signIn($input: SignInInput!) {
        signIn(input: $input) {
          accessToken
          expiredAt
        }
      }`;

      const authToken = new AuthToken(
        'accessToken',
        new Date('2022-08-01 11:22:33'),
      );
      userCommandUseCase.signIn.mockReturnValue(right(authToken));

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "signIn": Object {
              "accessToken": "accessToken",
              "expiredAt": "2022-08-01T02:22:33.000Z",
            },
          },
        }
      `);
    });
  });
});
