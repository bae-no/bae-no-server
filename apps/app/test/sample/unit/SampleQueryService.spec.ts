import { O, T } from '@app/custom/effect';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { faker } from '@faker-js/faker';
import { mock, mockReset } from 'jest-mock-extended';

import type { SampleQueryRepositoryPort } from '../../../src/module/sample/application/port/out/SampleQueryRepositoryPort';
import { SampleQueryService } from '../../../src/module/sample/application/service/SampleQueryService';
import { Sample, SampleId } from '../../../src/module/sample/domain/Sample';
import { assertResolvesFail, assertResolvesSuccess } from '../../fixture/utils';

describe('SampleQueryService', () => {
  const sampleQueryRepositoryPort = mock<SampleQueryRepositoryPort>();
  const sampleQueryService = new SampleQueryService(sampleQueryRepositoryPort);

  beforeEach(() => {
    mockReset(sampleQueryRepositoryPort);
  });

  describe('findById', () => {
    it('데이터가 존재하지 않으면 left 를 반환한다', async () => {
      // given
      sampleQueryRepositoryPort.findById.mockReturnValue(T.succeed(O.none));
      const id = SampleId(faker.database.mongodbObjectId());

      // when
      const result = sampleQueryService.findById(id);

      // then
      await assertResolvesFail(result, (value) => {
        expect(value).toBeInstanceOf(NotFoundException);
      });
    });

    it('주어진 샘플을 조회한다', async () => {
      // given
      const sample = Sample.of({ email: 'email', name: 'name' });
      sampleQueryRepositoryPort.findById.mockReturnValue(
        T.succeed(O.some(sample)),
      );
      const id = SampleId(faker.database.mongodbObjectId());

      // when
      const result = sampleQueryService.findById(id);

      // then
      await assertResolvesSuccess(result, (value) => {
        expect(value.name).toBe(sample.name);
        expect(value.email).toBe(sample.email);
      });
    });
  });
});
