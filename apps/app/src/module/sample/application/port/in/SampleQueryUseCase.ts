import { Sample } from '../../../domain/Sample';

export abstract class SampleQueryUseCase {
  abstract findById(id: string): Promise<Sample>;
}
