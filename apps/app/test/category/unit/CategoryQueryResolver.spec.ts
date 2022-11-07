import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { CategoryQueryResolver } from '../../../src/module/category/adapter/in/gql/CategoryQueryResolver';
import { graphQLTestHelper } from '../../fixture/graphqlTestHelper';
import { gql } from '../../fixture/utils';

describe('CategoryQueryResolver', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await graphQLTestHelper({
      providers: [CategoryQueryResolver],
    });
  });

  afterAll(async () => app.close());

  describe('categories', () => {
    it('모든 카테고리를 조회한다', async () => {
      // given
      const query = gql`
        query categories {
          categories {
            auth {
              code
              name
            }
            shareDealSort {
              code
              name
            }
          }
        }
      `;

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "categories": {
              "auth": [
                {
                  "code": "KAKAO",
                  "name": "카카오",
                },
                {
                  "code": "GOOGLE",
                  "name": "구글",
                },
                {
                  "code": "APPLE",
                  "name": "애플",
                },
              ],
              "shareDealSort": [
                {
                  "code": "LATEST",
                  "name": "등록순",
                },
                {
                  "code": "POPULAR",
                  "name": "인원순",
                },
                {
                  "code": "PARTICIPANTS",
                  "name": "입장가능순",
                },
              ],
            },
          },
        }
      `);
    });
  });
});
