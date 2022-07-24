import { right } from 'fp-ts/TaskEither';
import { mock, mockReset } from 'jest-mock-extended';

import { CreateSampleCommand } from '../../../../src/module/sample/application/port/in/CreateSampleCommand';
import { SampleRepositoryPort } from '../../../../src/module/sample/application/port/out/SampleRepositoryPort';
import { SampleCommandService } from '../../../../src/module/sample/application/service/SampleCommandService';
import { Sample } from '../../../../src/module/sample/domain/Sample';
import { assertResolvesRight } from '../../../fixture';

describe('SampleCommandService', () => {
  const sampleRepositoryPort = mock<SampleRepositoryPort>();
  const sampleQueryService = new SampleCommandService(sampleRepositoryPort);

  beforeEach(() => {
    mockReset(sampleRepositoryPort);
  });

  describe('create', () => {
    it('주어진 샘플을 생성한다', async () => {
      // given
      const command = new CreateSampleCommand('name', 'email');
      const sample = Sample.of({ name: 'name', email: 'email' });
      sampleRepositoryPort.save.mockReturnValue(right(sample));

      // when
      const result = sampleQueryService.create(command);

      // then
      await assertResolvesRight(result, (value) => {
        expect(value.name).toEqual(sample.name);
        expect(value.email).toEqual(sample.email);
      });
    });
  });
});
