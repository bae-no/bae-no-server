import { T } from '@app/custom/effect';
import { faker } from '@faker-js/faker';
import type { INestApplication } from '@nestjs/common';
import { mock, mockReset } from 'jest-mock-extended';
import * as request from 'supertest';

import { SampleQueryResolver } from '../../../src/module/sample/adapter/in/gql/SampleQueryResolver';
import { SampleQueryUseCase } from '../../../src/module/sample/application/port/in/SampleQueryUseCase';
import { Sample } from '../../../src/module/sample/domain/Sample';
import { graphQLTestHelper } from '../../fixture/graphqlTestHelper';
import { gql } from '../../fixture/utils';

describe('SampleQueryResolver', () => {
  let app: INestApplication;
  const sampleQueryUseCase = mock<SampleQueryUseCase>();

  beforeAll(async () => {
    app = await graphQLTestHelper({
      providers: [
        SampleQueryResolver,
        {
          provide: SampleQueryUseCase,
          useValue: sampleQueryUseCase,
        },
      ],
    });
  });

  afterAll(async () => app.close());

  beforeEach(() => {
    mockReset(sampleQueryUseCase);
  });

  describe('sample', () => {
    it('주어진 샘플을 조회한다', async () => {
      // given
      const id = faker.database.mongodbObjectId();
      const query = gql`query {
        sample(id: "${id}") {
          name
          email
        }
      }`;
      const sample = Sample.of({ name: 'name', email: 'email' });
      sampleQueryUseCase.findById.mockReturnValue(T.succeed(sample));

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "sample": {
              "email": "email",
              "name": "name",
            },
          },
        }
      `);
    });
  });
});
