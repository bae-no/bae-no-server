import { T } from '@app/custom/effect';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { mock, mockReset } from 'vitest-mock-extended';

import { SendPhoneVerificationCodeInput } from '../../../src/module/user/adapter/in/gql/input/SendPhoneVerificationCodeInput';
import { VerifyPhoneVerificationCodeInput } from '../../../src/module/user/adapter/in/gql/input/VerifyPhoneVerificationCodeInput';
import { PhoneVerificationMutationResolver } from '../../../src/module/user/adapter/in/gql/PhoneVerificationMutationResolver';
import { PhoneVerificationUseCase } from '../../../src/module/user/application/port/in/PhoneVerificationUseCase';
import { ExpiredCodeException } from '../../../src/module/user/domain/exception/ExpiredCodeException';
import { MismatchedCodeException } from '../../../src/module/user/domain/exception/MismatchedCodeException';
import {
  graphQLTestHelper,
  setMockUser,
} from '../../fixture/graphqlTestHelper';
import { gql } from '../../fixture/utils';

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

      const mutation = gql`
        mutation sendCode($input: SendPhoneVerificationCodeInput!) {
          sendPhoneVerificationCode(input: $input)
        }
      `;

      phoneVerificationUseCase.sendCode.mockReturnValue(T.unit);

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
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

      const mutation = gql`
        mutation verify($input: VerifyPhoneVerificationCodeInput!) {
          verifyPhoneVerificationCode(input: $input)
        }
      `;

      phoneVerificationUseCase.verify.mockReturnValue(T.unit);

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "verifyPhoneVerificationCode": true,
          },
        }
      `);
    });

    it('인증번호 검증에 실패한다', async () => {
      // given
      const input = new VerifyPhoneVerificationCodeInput();
      input.code = '01011112222';

      const mutation = gql`
        mutation verify($input: VerifyPhoneVerificationCodeInput!) {
          verifyPhoneVerificationCode(input: $input)
        }
      `;

      phoneVerificationUseCase.verify.mockReturnValue(
        T.fail(new MismatchedCodeException('mismatch')),
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
                "code": "MISMATCHED_CODE",
              },
              "locations": [
                {
                  "column": 11,
                  "line": 3,
                },
              ],
              "message": "mismatch",
              "path": [
                "verifyPhoneVerificationCode",
              ],
            },
          ],
        }
      `);
    });

    it('만료된 인증코드인 경우 예외가 발생한다.', async () => {
      // given
      const input = new VerifyPhoneVerificationCodeInput();
      input.code = '01011112222';

      const mutation = gql`
        mutation verify($input: VerifyPhoneVerificationCodeInput!) {
          verifyPhoneVerificationCode(input: $input)
        }
      `;

      phoneVerificationUseCase.verify.mockReturnValue(
        T.fail(new ExpiredCodeException('expired')),
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
                "code": "EXPIRED_CODE",
              },
              "locations": [
                {
                  "column": 11,
                  "line": 3,
                },
              ],
              "message": "expired",
              "path": [
                "verifyPhoneVerificationCode",
              ],
            },
          ],
        }
      `);
    });
  });
});
