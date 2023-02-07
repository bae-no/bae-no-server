export interface BaseEntityProps<PK> {
  id: PK;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseBrandedEntity<PROPS, PK>
  implements BaseEntityProps<PK>
{
  protected props: PROPS;

  private readonly _id: PK;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  protected constructor(props: PROPS) {
    this.props = props;
  }

  get id(): PK {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  setBase(id: PK, createdAt: Date, updatedAt: Date) {
    (this._id as any) = id;
    (this._createdAt as any) = createdAt;
    this._updatedAt = updatedAt;

    return this;
  }
}
