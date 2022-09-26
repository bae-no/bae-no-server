import { BaseEntity } from '@app/domain/entity/BaseEntity';
import { IllegalStateException } from '@app/domain/exception/IllegalStateException';
import * as E from 'fp-ts/Either';
import { Either } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';

import { PhoneVerification } from './PhoneVerification';
import { Address } from './vo/Address';
import { Agreement } from './vo/Agreement';
import { Auth } from './vo/Auth';
import { LeaveReason } from './vo/LeaveReason';
import { Profile } from './vo/Profile';
import { UserAddressList } from './vo/UserAddressList';

export interface UserProps {
  nickname: string;
  phoneNumber: string;
  auth: Auth;
  agreement: Agreement;
  profile: Profile;
  addressList: UserAddressList;
  leaveReason: LeaveReason | null;
}

export class User extends BaseEntity<UserProps> {
  constructor(props: UserProps) {
    super(props);
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

  get addresses(): Address[] {
    return this.props.addressList.addresses;
  }

  get isPhoneNumberVerified(): boolean {
    return !!this.props.phoneNumber;
  }

  get hasProfile(): boolean {
    return !!this.props.nickname && this.props.addressList.count > 0;
  }

  get leaveReason(): LeaveReason | null {
    return this.props.leaveReason;
  }

  static byAuth(auth: Auth): User {
    return new User({
      nickname: '',
      phoneNumber: '',
      auth,
      agreement: new Agreement(false, false),
      profile: new Profile('', ''),
      addressList: UserAddressList.of(),
      leaveReason: null,
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

  enroll(nickname: string, address: Address): this {
    this.props.nickname = nickname;
    this.props.addressList = UserAddressList.of([address]);

    return this;
  }

  leave(name: string, reason: string, now: Date): this {
    this.props.leaveReason = new LeaveReason(now, name, reason);
    this.props.auth = this.props.auth.clear();

    return this;
  }

  appendAddress(address: Address): Either<IllegalStateException, this> {
    try {
      this.props.addressList = UserAddressList.of([...this.addresses, address]);

      return E.right(this);
    } catch (err) {
      return E.left(new IllegalStateException((err as Error).message));
    }
  }

  deleteAddress(key: string): this {
    this.props.addressList = this.props.addressList.delete(key);

    return this;
  }

  updateProfile(introduce: string): this {
    this.props.profile = new Profile('', introduce);

    return this;
  }
}
