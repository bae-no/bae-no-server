import { BaseEntity } from '@app/domain/entity/BaseEntity';
import { IllegalStateException } from '@app/domain/exception/IllegalStateException';
import { Either } from 'fp-ts/Either';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';

import { PhoneVerification } from './PhoneVerification';
import { Address } from './vo/Address';
import { AddressType } from './vo/AddressType';
import { Agreement } from './vo/Agreement';
import { Auth } from './vo/Auth';
import { Profile } from './vo/Profile';

export interface UserProps {
  nickname: string;
  phoneNumber: string;
  auth: Auth;
  agreement: Agreement;
  profile: Profile;
  address: Address;
}

export class User extends BaseEntity<UserProps> {
  constructor(props: UserProps) {
    super(props);
  }

  static byAuth(auth: Auth): User {
    return new User({
      nickname: '',
      phoneNumber: '',
      auth,
      agreement: new Agreement(false, false),
      profile: new Profile('', ''),
      address: new Address('', '', '', AddressType.ETC, 0, 0),
    });
  }

  updateByPhoneVerification(
    phoneVerification: PhoneVerification,
    code: string,
  ): Either<IllegalStateException, this> {
    return pipe(
      phoneVerification.verify(code),
      E.map(() => {
        this.props.phoneNumber = phoneVerification.phoneNumber;

        return this;
      }),
    );
  }

  enroll(nickname: string, address: Address) {
    this.props.nickname = nickname;
    this.props.address = address;
  }

  get nickname(): string {
    return this.props.nickname;
  }

  get phoneNumber(): string {
    return this.props.phoneNumber;
  }

  get auth(): Auth {
    return this.props.auth;
  }

  get agreement(): Agreement {
    return this.props.agreement;
  }

  get profile(): Profile {
    return this.props.profile;
  }

  get address(): Address {
    return this.props.address;
  }

  get isPhoneNumberVerified(): boolean {
    return !!this.props.phoneNumber;
  }

  get hasProfile(): boolean {
    return !!this.props.nickname && !!this.props.address.type;
  }
}
