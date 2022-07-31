import { INestApplication } from '@nestjs/common';
import { right } from 'fp-ts/TaskEither';
import { mock } from 'jest-mock-extended';
import * as request from 'supertest';

import { StubPubSubModule } from '../../../../../libs/pub-sub/test/StubPubSubModule';
import { CreateSampleInput } from '../../../src/module/sample/adapter/in/gql/input/CreateSampleInput';
import { SampleMutationResolver } from '../../../src/module/sample/adapter/in/gql/SampleMutationResolver';
import { SampleCommandUseCase } from '../../../src/module/sample/application/port/in/SampleCommandUseCase';
import { Sample } from '../../../src/module/sample/domain/Sample';
import { graphQLTestHelper } from '../../fixture/graphqlTestHelper';

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

  describe('createSample', () => {
    it('주어진 샘플을 생성한다', async () => {
      // given
      const input = new CreateSampleInput();
      input.name = 'name';
      input.email = 'email';

      // language=GraphQL
      const mutation = `mutation create($input: CreateSampleInput!) {
        createSample(input: $input) {
          name
          email
        }
      }`;
      const sample = Sample.of({ name: 'name', email: 'email' });
      sampleCommandUserCase.create.mockReturnValue(right(sample));

      // when
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: mutation, variables: { input } });

      // then
      expect(response.body).toEqual({
        data: { createSample: { name: sample.name, email: sample.email } },
      });
    });
  });
});
