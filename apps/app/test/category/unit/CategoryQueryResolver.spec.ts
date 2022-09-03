import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { CategoryQueryResolver } from '../../../src/module/category/adapter/in/gql/CategoryQueryResolver';
import { graphQLTestHelper } from '../../fixture/graphqlTestHelper';

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
      // language=GraphQL
      const query = `query categories {
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
      }`;

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "categories": Object {
              "auth": Array [
                Object {
                  "code": "KAKAO",
                  "name": "카카오",
                },
                Object {
                  "code": "GOOGLE",
                  "name": "구글",
                },
                Object {
                  "code": "APPLE",
                  "name": "애플",
                },
              ],
              "shareDealSort": Array [
                Object {
                  "code": "LATEST",
                  "name": "등록순",
                },
              ],
            },
          },
        }
      `);
    });
  });
});
