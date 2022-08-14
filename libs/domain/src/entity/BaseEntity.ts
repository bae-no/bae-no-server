export interface BaseEntityProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseEntity<T> implements BaseEntityProps {
  protected props: T;

  private readonly _id: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  protected constructor(props: T) {
    this.props = props;
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  setBase(id: string, createdAt: Date, updatedAt: Date) {
    (this._id as any) = id.toString();
    (this._createdAt as any) = createdAt;
    this._updatedAt = updatedAt;

    return this;
  }
}
