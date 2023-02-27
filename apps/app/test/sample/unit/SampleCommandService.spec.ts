import { T } from '@app/custom/effect';
import { mock, mockReset } from 'jest-mock-extended';

import { CreateSampleCommand } from '../../../src/module/sample/application/port/in/dto/CreateSampleCommand';
import type { SampleRepositoryPort } from '../../../src/module/sample/application/port/out/SampleRepositoryPort';
import { SampleCommandService } from '../../../src/module/sample/application/service/SampleCommandService';
import { Sample } from '../../../src/module/sample/domain/Sample';
import { assertResolvesSuccess } from '../../fixture/utils';

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
      sampleRepositoryPort.save.mockReturnValue(T.succeed(sample));

      // when
      const result = sampleQueryService.create(command);

      // then
      await assertResolvesSuccess(result, (value) => {
        expect(value.name).toBe(sample.name);
        expect(value.email).toBe(sample.email);
      });
    });
  });
});
