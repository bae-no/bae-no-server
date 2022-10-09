export class ParticipantInfo {
  constructor(
    readonly ids: string[],
    readonly min: number,
    readonly current: number,
    readonly remaining: number,
  ) {}

  static of(ids: string[], min: number): ParticipantInfo {
    return new ParticipantInfo(
      ids,
      min,
      ids.length,
      Math.max(min - ids.length, 0),
    );
  }

  addId(id: string): ParticipantInfo {
    if (this.hasId(id)) {
      return this;
    }

    return new ParticipantInfo(
      [...this.ids, id],
      this.min,
      this.current + 1,
      Math.max(this.remaining - 1, 0),
    );
  }

  hasId(id: string) {
    return this.ids.includes(id);
  }
}
