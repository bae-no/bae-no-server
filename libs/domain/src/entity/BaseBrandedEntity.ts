export interface BaseEntityProps<PK> {
  id: PK;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class BaseBrandedEntity<PROPS, PK>
  implements BaseEntityProps<PK>
{
  protected props: PROPS;

  #id: PK;
  #createdAt: Date;
  #updatedAt: Date;

  protected constructor(props: PROPS) {
    this.props = props;
  }

  get id(): PK {
    return this.#id;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get updatedAt(): Date {
    return this.#updatedAt;
  }

  setBase(id: PK, createdAt: Date, updatedAt: Date) {
    this.#id = id;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;

    return this;
  }
}
