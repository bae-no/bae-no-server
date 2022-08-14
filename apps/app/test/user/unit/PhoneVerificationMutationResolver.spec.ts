import { TE } from '@app/external/fp-ts';
import { INestApplication } from '@nestjs/common';
import { mock, mockReset } from 'jest-mock-extended';
import * as request from 'supertest';

import { SendPhoneVerificationCodeInput } from '../../../src/module/user/adapter/in/gql/input/SendPhoneVerificationCodeInput';
import { VerifyPhoneVerificationCodeInput } from '../../../src/module/user/adapter/in/gql/input/VerifyPhoneVerificationCodeInput';
import { PhoneVerificationMutationResolver } from '../../../src/module/user/adapter/in/gql/PhoneVerificationMutationResolver';
import { PhoneVerificationUseCase } from '../../../src/module/user/application/port/in/PhoneVerificationUseCase';
import {
  graphQLTestHelper,
  setMockUser,
} from '../../fixture/graphqlTestHelper';

describe('PhoneVerificationMutationResolver ', () => {
  const phoneVerificationUseCase = mock<PhoneVerificationUseCase>();
  let app: INestApplication;

  beforeAll(async () => {
    app = await graphQLTestHelper({
      providers: [
        PhoneVerificationMutationResolver,
        {
          provide: PhoneVerificationUseCase,
          useValue: phoneVerificationUseCase,
        },
      ],
    });
    setMockUser();
  });

  afterAll(async () => app.close());

  beforeEach(() => {
    mockReset(phoneVerificationUseCase);
  });

  describe('sendPhoneVerificationCode', () => {
    it('인증번호 발급요청에 성공한다', async () => {
      // given
      const input = new SendPhoneVerificationCodeInput();
      input.phoneNumber = '01011112222';

      // language=GraphQL
      const mutation = `mutation sendCode($input: SendPhoneVerificationCodeInput!) {
        sendPhoneVerificationCode(input: $input)
      }`;

      phoneVerificationUseCase.sendCode.mockReturnValue(TE.right(undefined));

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "sendPhoneVerificationCode": true,
          },
        }
      `);
    });
  });

  describe('verifyPhoneVerificationCode', () => {
    it('인증번호 검증에 성공한다', async () => {
      // given
      const input = new VerifyPhoneVerificationCodeInput();
      input.code = '01011112222';

      // language=GraphQL
      const mutation = `mutation verify($input: VerifyPhoneVerificationCodeInput!) {
        verifyPhoneVerificationCode(input: $input)
      }`;

      phoneVerificationUseCase.verify.mockReturnValue(TE.right(undefined));

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "verifyPhoneVerificationCode": true,
          },
        }
      `);
    });
  });
});
