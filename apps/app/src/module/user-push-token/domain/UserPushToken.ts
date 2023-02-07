import { BaseEntity } from '@app/domain/entity/BaseEntity';

import { UserId } from '../../user/domain/User';

export interface UserPushTokenProps {
  userId: UserId;
  token: string;
}

export class UserPushToken extends BaseEntity<UserPushTokenProps> {
  constructor(props: UserPushTokenProps) {
    super(props);
  }

  get userId(): string {
    return this.props.userId;
  }

  get token(): string {
    return this.props.token;
  }
}
