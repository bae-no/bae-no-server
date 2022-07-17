export abstract class BaseEntity {
  private readonly _id: string;
  private readonly _createdAt: Date = new Date();
  private _updatedAt: Date = new Date();

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
