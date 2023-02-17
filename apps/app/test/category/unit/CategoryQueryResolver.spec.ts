import type { INestApplication } from '@nestjs/common';
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
            foodCatalog {
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
              "foodCatalog": [
                {
                  "code": "KOREAN",
                  "name": "한식",
                },
                {
                  "code": "CHINESE",
                  "name": "중식",
                },
                {
                  "code": "JAPANESE",
                  "name": "일식",
                },
                {
                  "code": "AMERICAN",
                  "name": "양식",
                },
                {
                  "code": "STREET",
                  "name": "분식",
                },
                {
                  "code": "CHICKEN",
                  "name": "치킨",
                },
                {
                  "code": "PIZZA",
                  "name": "피자",
                },
                {
                  "code": "BURGER",
                  "name": "버거",
                },
                {
                  "code": "SOUP",
                  "name": "찜/탕",
                },
                {
                  "code": "MEAT",
                  "name": "고기/구이",
                },
                {
                  "code": "ASIAN",
                  "name": "아시아",
                },
                {
                  "code": "DESERT",
                  "name": "디저트",
                },
                {
                  "code": "SALAD",
                  "name": "샐러드",
                },
                {
                  "code": "LUNCH_BOX",
                  "name": "도시락",
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
                {
                  "code": "DISTANCE",
                  "name": "거리순",
                },
              ],
            },
          },
        }
      `);
    });
  });
});
