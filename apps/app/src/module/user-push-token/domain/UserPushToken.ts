import { BaseEntity } from '@app/domain/entity/BaseEntity';

import type { UserId } from '../../user/domain/User';

export interface UserPushTokenProps {
  userId: UserId;
  token: string;
}

export class UserPushToken extends BaseEntity<UserPushTokenProps> {
  constructor(props: UserPushTokenProps) {
    super(props);
  }

  get userId(): UserId {
    return this.props.userId;
  }

  get token(): string {
    return this.props.token;
  }

  static create(props: UserPushTokenProps): UserPushToken {
    return new UserPushToken(props);
  }

  update(token: string): this {
    this.props.token = token;

    return this;
  }
}
