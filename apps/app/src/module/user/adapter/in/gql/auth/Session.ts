import { UserId } from '../../../../domain/User';

export class Session {
  constructor(readonly id: UserId) {}
}
