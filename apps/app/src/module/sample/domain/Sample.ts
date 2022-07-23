import { BaseEntity } from '@app/domain/entity/BaseEntity';

export interface CreateSampleProps {
  email: string;
  name: string;
}

export interface SampleProps {
  email: string;
  name: string;
}

export class Sample extends BaseEntity<SampleProps> {
  private constructor(props: SampleProps) {
    super(props);
  }

  static of(props: CreateSampleProps) {
    return new Sample(props);
  }

  get email(): string {
    return this.props.email;
  }

  get name(): string {
    return this.props.name;
  }
}
