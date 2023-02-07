import { BaseBrandedEntity } from '@app/domain/entity/BaseBrandedEntity';
import { Branded } from '@app/domain/entity/Branded';

export interface CreateSampleProps {
  email: string;
  name: string;
}

export interface SampleProps {
  email: string;
  name: string;
}

export type SampleId = Branded<string, 'SampleId'>;

export function SampleId(id: string): SampleId {
  return id as SampleId;
}

export class Sample extends BaseBrandedEntity<SampleProps, SampleId> {
  private constructor(props: SampleProps) {
    super(props);
  }

  get email(): string {
    return this.props.email;
  }

  get name(): string {
    return this.props.name;
  }

  static of(props: CreateSampleProps) {
    return new Sample(props);
  }
}
