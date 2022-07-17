import { Sample } from '../../../domain/Sample';

export abstract class SampleQueryRepositoryPort {
  abstract findById(id: string): Promise<Sample | null>;
}
