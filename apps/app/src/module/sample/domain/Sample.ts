import { BaseEntity } from '@app/domain/entity/BaseEntity';

export interface CreateSampleProps {
  email: string;
  name: string;
}

export class Sample extends BaseEntity {
  private _email: string;
  private _name: string;

  private constructor() {
    super();
  }

  static of({ email, name }: CreateSampleProps) {
    const entity = new Sample();

    entity._email = email;
    entity._name = name;

    return entity;
  }

  static empty() {
    return new Sample();
  }

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }
}
