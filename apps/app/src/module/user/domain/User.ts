import { BaseEntity } from '@app/domain/entity/BaseEntity';

import { Auth } from './Auth';

export interface UserProps {
  auth: Auth;
}

export class User extends BaseEntity<UserProps> {
  constructor(props: UserProps) {
    super(props);
  }

  get auth(): Auth {
    return this.props.auth;
  }
}
