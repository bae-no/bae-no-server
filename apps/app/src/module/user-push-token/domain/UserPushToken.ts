import { BaseEntity } from '@app/domain/entity/BaseEntity';

export interface UserPushTokenProps {
  userId: string;
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
