import { INestApplication } from '@nestjs/common';
import { right } from 'fp-ts/TaskEither';
import { mock } from 'jest-mock-extended';
import * as request from 'supertest';

import { SignInInput } from '../../../src/module/user/adapter/in/gql/input/SignInInput';
import { UserMutationResolver } from '../../../src/module/user/adapter/in/gql/UserMutationResolver';
import { AuthToken } from '../../../src/module/user/application/port/in/dto/AuthToken';
import { SignInUserDto } from '../../../src/module/user/application/port/in/dto/SignInUserDto';
import { UserCommandUseCase } from '../../../src/module/user/application/port/in/UserCommandUseCase';
import { User } from '../../../src/module/user/domain/User';
import { Auth } from '../../../src/module/user/domain/vo/Auth';
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
          isPhoneNumberVerified
          hasProfile
        }
      }`;

      const authToken = new AuthToken(
        'accessToken',
        new Date('2022-08-01 11:22:33'),
      );
      const auth = new Auth('socialId', AuthType.APPLE);
      const user = User.byAuth(auth);
      userCommandUseCase.signIn.mockReturnValue(
        right(new SignInUserDto(authToken, user)),
      );

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
              "hasProfile": false,
              "isPhoneNumberVerified": false,
            },
          },
        }
      `);
    });
  });
});
