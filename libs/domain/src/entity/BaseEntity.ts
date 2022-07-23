export interface BaseEntityProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseEntity<T> implements BaseEntityProps {
  private readonly _id: string;
  private readonly _createdAt: Date = new Date();
  private _updatedAt: Date = new Date();

  protected props: T;

  protected constructor(props: T) {
    this.props = props;
  }

  setBase(id: string, createdAt: Date, updatedAt: Date) {
    (this._id as any) = id.toString();
    (this._createdAt as any) = createdAt;
    this._updatedAt = updatedAt;

    return this;
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
}
