import { INestApplication } from '@nestjs/common';
import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';
import * as request from 'supertest';

import { AddressInput } from '../../../src/module/user/adapter/in/gql/input/AddressInput';
import { CoordinateInput } from '../../../src/module/user/adapter/in/gql/input/CoordinateInput';
import { EnrollUserInput } from '../../../src/module/user/adapter/in/gql/input/EnrollUserInput';
import { LeaveUserInput } from '../../../src/module/user/adapter/in/gql/input/LeaveUserInput';
import { SignInInput } from '../../../src/module/user/adapter/in/gql/input/SignInInput';
import { UserMutationResolver } from '../../../src/module/user/adapter/in/gql/UserMutationResolver';
import { AuthToken } from '../../../src/module/user/application/port/in/dto/AuthToken';
import { SignInUserDto } from '../../../src/module/user/application/port/in/dto/SignInUserDto';
import { UserCommandUseCase } from '../../../src/module/user/application/port/in/UserCommandUseCase';
import { User } from '../../../src/module/user/domain/User';
import { AddressType } from '../../../src/module/user/domain/vo/AddressType';
import { Auth } from '../../../src/module/user/domain/vo/Auth';
import { AuthType } from '../../../src/module/user/domain/vo/AuthType';
import {
  clearMockUser,
  graphQLTestHelper,
  setMockUser,
} from '../../fixture/graphqlTestHelper';

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

  beforeEach(() => {
    mockReset(userCommandUseCase);
    clearMockUser();
  });

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
        {
          "data": {
            "signIn": {
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

  describe('enrollUser', () => {
    it('주소 타입이 ETC 인데 alias 가 없으면 에러가 발생한다', async () => {
      // given
      const input = new EnrollUserInput();
      input.nickname = 'enrollUser';
      const address = new AddressInput();
      address.type = AddressType.ETC;
      address.road = 'road';
      address.detail = 'address';
      input.address = address;
      const coordinate = new CoordinateInput();
      coordinate.latitude = 70.1;
      coordinate.longitude = 120.3;
      input.address.coordinate = coordinate;

      // language=GraphQL
      const mutation = `mutation enrollUser($input: EnrollUserInput!) {
        enrollUser(input: $input)
      }`;

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
                "code": "BAD_USER_INPUT",
                "response": {
                  "error": "Bad Request",
                  "message": [
                    "address.alias should not be empty",
                  ],
                  "statusCode": 400,
                },
              },
              "message": "Bad Request Exception",
            },
          ],
        }
      `);
    });

    it('사용자 등록 요청에 성공한다', async () => {
      // given
      const input = new EnrollUserInput();
      input.nickname = 'enrollUser';
      const address = new AddressInput();
      address.type = AddressType.ETC;
      address.road = 'road';
      address.detail = 'address';
      address.alias = 'alias';
      input.address = address;
      const coordinate = new CoordinateInput();
      coordinate.latitude = 70.1;
      coordinate.longitude = 120.3;
      input.address.coordinate = coordinate;

      // language=GraphQL
      const mutation = `mutation enrollUser($input: EnrollUserInput!) {
        enrollUser(input: $input)
      }`;

      userCommandUseCase.enroll.mockReturnValue(right(undefined));
      setMockUser();

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "enrollUser": true,
          },
        }
      `);
    });
  });

  describe('leave', () => {
    it('회원탈퇴에 성공한다', async () => {
      // given
      const input = new LeaveUserInput();
      input.name = 'name';
      input.reason = 'reason';

      // language=GraphQL
      const mutation = `mutation leave($input: LeaveUserInput!) {
        leave(input: $input)
      }`;

      userCommandUseCase.leave.mockReturnValue(right(undefined));
      setMockUser();

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "leave": true,
          },
        }
      `);
    });
  });

  describe('appendAddress', () => {
    it('주소 추가 요청에 성공한다', async () => {
      // given
      const input = new AddressInput();
      input.type = AddressType.HOME;
      input.road = 'road';
      input.detail = 'address';
      const coordinate = new CoordinateInput();
      coordinate.latitude = 70.1;
      coordinate.longitude = 120.3;
      input.coordinate = coordinate;

      // language=GraphQL
      const mutation = `mutation appendAddress($input: AddressInput!) {
        appendAddress(input: $input)
      }`;

      userCommandUseCase.appendAddress.mockReturnValue(right(undefined));
      setMockUser();

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "appendAddress": true,
          },
        }
      `);
    });
  });

  describe('deleteAddress', () => {
    it('주소 삭제 요청에 성공한다', async () => {
      // given
      // language=GraphQL
      const mutation = `mutation deleteAddress {
        deleteAddress(key: "5")
      }`;

      userCommandUseCase.deleteAddress.mockReturnValue(right(undefined));
      setMockUser();

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "deleteAddress": true,
          },
        }
      `);
    });
  });
});
