import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';
import * as request from 'supertest';

import { SampleQueryResolver } from '../../../src/module/sample/adapter/in/gql/SampleQueryResolver';
import { SampleQueryUseCase } from '../../../src/module/sample/application/port/in/SampleQueryUseCase';
import { Sample } from '../../../src/module/sample/domain/Sample';
import { graphQLTestHelper } from '../../fixture/graphqlTestHelper';

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
      // language=GraphQL
      const query = `query {
        sample(id: "${id}") {
          name
          email
        }
      }`;
      const sample = Sample.of({ name: 'name', email: 'email' });
      sampleQueryUseCase.findById.mockReturnValue(right(sample));

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
