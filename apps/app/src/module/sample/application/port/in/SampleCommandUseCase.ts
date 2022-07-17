import { Sample } from '../../../domain/Sample';
import { CreateSampleCommand } from './CreateSampleCommand';

export abstract class SampleCommandUseCase {
  abstract create(command: CreateSampleCommand): Promise<Sample>;
}
