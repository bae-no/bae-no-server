import type { UserId } from '../../../user/domain/User';

export class ParticipantInfo {
  constructor(
    readonly ids: UserId[],
    readonly max: number,
    readonly current: number,
    readonly remaining: number,
  ) {}

  get canStart(): boolean {
    return this.remaining <= this.current;
  }

  get hasRemaining(): boolean {
    return this.remaining > 0;
  }

  static of(ids: UserId[], max: number): ParticipantInfo {
    return new ParticipantInfo(
      ids,
      max,
      ids.length,
      Math.max(max - ids.length, 0),
    );
  }

  addId(id: UserId): ParticipantInfo {
    if (this.hasId(id)) {
      return this;
    }

    return new ParticipantInfo(
      [...this.ids, id],
      this.max,
      this.current + 1,
      Math.max(this.remaining - 1, 0),
    );
  }

  removeId(id: UserId): ParticipantInfo {
    return new ParticipantInfo(
      this.ids.filter((participantId) => participantId !== id),
      this.max,
      this.current - 1,
      this.remaining + 1,
    );
  }

  hasId(id: UserId) {
    return this.ids.includes(id);
  }

  isLessOrEquals(value: number): boolean {
    return this.current <= value;
  }
}
