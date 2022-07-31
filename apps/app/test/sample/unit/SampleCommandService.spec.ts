import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { none, some } from 'fp-ts/Option';
import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';

import { SampleQueryRepositoryPort } from '../../../src/module/sample/application/port/out/SampleQueryRepositoryPort';
import { SampleQueryService } from '../../../src/module/sample/application/service/SampleQueryService';
import { Sample } from '../../../src/module/sample/domain/Sample';
import { assertResolvesLeft, assertResolvesRight } from '../../fixture';

describe('SampleQueryService', () => {
  const sampleQueryRepositoryPort = mock<SampleQueryRepositoryPort>();
  const sampleQueryService = new SampleQueryService(sampleQueryRepositoryPort);

  beforeEach(() => {
    mockReset(sampleQueryRepositoryPort);
  });

  describe('findById', () => {
    it('데이터가 존재하지 않으면 left 를 반환한다', async () => {
      // given
      sampleQueryRepositoryPort.findById.mockReturnValue(right(none));
      const id = '507f191e810c19729de860ea';

      // when
      const result = sampleQueryService.findById(id);

      // then
      await assertResolvesLeft(result, (value) => {
        expect(value).toBeInstanceOf(NotFoundException);
      });
    });

    it('주어진 샘플을 조회한다', async () => {
      // given
      const sample = Sample.of({ email: 'email', name: 'name' });
      sampleQueryRepositoryPort.findById.mockReturnValue(right(some(sample)));
      const id = '507f191e810c19729de860ea';

      // when
      const result = sampleQueryService.findById(id);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value.name).toEqual(sample.name);
        expect(value.email).toEqual(sample.email);
      });
    });
  });
});
