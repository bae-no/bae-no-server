import { Sample } from '../../../domain/Sample';

export abstract class SampleRepositoryPort {
  abstract save(sample: Sample): Promise<Sample>;
}
