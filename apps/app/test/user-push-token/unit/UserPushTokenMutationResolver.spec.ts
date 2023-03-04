import { T } from '@app/custom/effect';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest';
import { mock, mockReset } from 'vitest-mock-extended';

import { UpdateUserPushTokenInput } from '../../../src/module/user-push-token/adapter/in/gql/input/UpdateUserPushTokenInput';
import { UserPushTokenMutationResolver } from '../../../src/module/user-push-token/adapter/in/gql/UserPushTokenMutationResolver';
import { UserPushTokenCommandUseCase } from '../../../src/module/user-push-token/application/port/in/UserPushTokenCommandUseCase';
import {
  clearMockUser,
  graphQLTestHelper,
  setMockUser,
} from '../../fixture/graphqlTestHelper';
import { gql } from '../../fixture/utils';

describe('UserPushTokenMutationResolver', () => {
  const userPushTokenCommandUseCase = mock<UserPushTokenCommandUseCase>();
  let app: INestApplication;

  beforeAll(async () => {
    app = await graphQLTestHelper({
      providers: [
        UserPushTokenMutationResolver,
        {
          provide: UserPushTokenCommandUseCase,
          useValue: userPushTokenCommandUseCase,
        },
      ],
    });
  });

  afterAll(async () => app.close());

  beforeEach(() => {
    mockReset(userPushTokenCommandUseCase);
    clearMockUser();
  });

  describe('updateUserPushToken', () => {
    it('푸시토큰 업데이트 요청에 성공한다', async () => {
      // given
      const input = new UpdateUserPushTokenInput();
      input.token = 'token';

      const mutation = gql`
        mutation updatePushToken($input: UpdateUserPushTokenInput!) {
          updateUserPushToken(input: $input)
        }
      `;

      userPushTokenCommandUseCase.update.mockReturnValue(T.unit);
      setMockUser();

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "updateUserPushToken": true,
          },
        }
      `);
    });
  });
});
