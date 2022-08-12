import { TE } from '@app/external/fp-ts';
import { INestApplication } from '@nestjs/common';
import { mock } from 'jest-mock-extended';
import * as request from 'supertest';

import { SendCodeInput } from '../../../src/module/user/adapter/in/gql/input/SendCodeInput';
import { PhoneVerificationResolver } from '../../../src/module/user/adapter/in/gql/PhoneVerificationResolver';
import { PhoneVerificationUseCase } from '../../../src/module/user/application/port/in/PhoneVerificationUseCase';
import {
  graphQLTestHelper,
  setMockUser,
} from '../../fixture/graphqlTestHelper';

describe('PhoneVerificationResolver ', () => {
  const phoneVerificationUseCase = mock<PhoneVerificationUseCase>();
  let app: INestApplication;

  beforeAll(async () => {
    app = await graphQLTestHelper({
      providers: [
        PhoneVerificationResolver,
        {
          provide: PhoneVerificationUseCase,
          useValue: phoneVerificationUseCase,
        },
      ],
    });
    setMockUser();
  });

  afterAll(async () => app.close());

  describe('signIn', () => {
    it('인증번호 발급요청에 성공한다', async () => {
      // given
      const input = new SendCodeInput();
      input.phoneNumber = '01011112222';

      // language=GraphQL
      const mutation = `mutation sendCode($input: SendCodeInput!) {
        sendCode(input: $input)
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
            "sendCode": true,
          },
        }
      `);
    });
  });
});
