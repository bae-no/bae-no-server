import { T } from '@app/custom/effect';
import type { INestApplication } from '@nestjs/common';
import { mock, mockReset } from 'jest-mock-extended';
import * as request from 'supertest';

import { StubPubSubModule } from '../../../../../libs/pub-sub/test/fixture/StubPubSubModule';
import { CreateSampleInput } from '../../../src/module/sample/adapter/in/gql/input/CreateSampleInput';
import { SampleMutationResolver } from '../../../src/module/sample/adapter/in/gql/SampleMutationResolver';
import { SampleCommandUseCase } from '../../../src/module/sample/application/port/in/SampleCommandUseCase';
import { Sample } from '../../../src/module/sample/domain/Sample';
import { graphQLTestHelper } from '../../fixture/graphqlTestHelper';
import { gql } from '../../fixture/utils';

describe('SampleMutationResolver', () => {
  const sampleCommandUserCase = mock<SampleCommandUseCase>();
  let app: INestApplication;

  beforeAll(async () => {
    app = await graphQLTestHelper({
      imports: [StubPubSubModule],
      providers: [
        SampleMutationResolver,
        {
          provide: SampleCommandUseCase,
          useValue: sampleCommandUserCase,
        },
      ],
    });
  });

  afterAll(async () => app.close());

  beforeEach(() => {
    mockReset(sampleCommandUserCase);
  });

  describe('createSample', () => {
    it('주어진 샘플을 생성한다', async () => {
      // given
      const input = new CreateSampleInput();
      input.name = 'name';
      input.email = 'email';

      const mutation = gql`
        mutation create($input: CreateSampleInput!) {
          createSample(input: $input) {
            name
            email
          }
        }
      `;
      const sample = Sample.of({ name: 'name', email: 'email' });
      sampleCommandUserCase.create.mockReturnValue(T.succeed(sample));

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables: { input } });

      // then
      expect(response.body).toMatchInlineSnapshot(`
        {
          "data": {
            "createSample": {
              "email": "email",
              "name": "name",
            },
          },
        }
      `);
    });
  });
});
