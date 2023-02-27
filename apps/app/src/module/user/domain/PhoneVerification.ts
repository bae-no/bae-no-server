import { randomInt } from 'node:crypto';

import { E } from '@app/custom/effect';
import { addMinutes, isAfter } from 'date-fns';

import { ExpiredCodeException } from './exception/ExpiredCodeException';
import { MismatchedCodeException } from './exception/MismatchedCodeException';

export class PhoneVerification {
  static readonly EXPIRATION_MINUTES = 3;

  private constructor(
    readonly phoneNumber: string,
    readonly code: string,
    readonly expiredAt: Date,
  ) {}

  static of(phoneNumber: string, code?: string, expiredAt?: Date) {
    return new PhoneVerification(
      phoneNumber,
      code ?? randomInt(9999).toString().padStart(4, '0'),
      expiredAt ?? addMinutes(new Date(), PhoneVerification.EXPIRATION_MINUTES),
    );
  }

  verify(
    code: string,
    now = new Date(),
  ): E.Either<ExpiredCodeException | MismatchedCodeException, void> {
    if (this.code !== code) {
      return E.left(
        new MismatchedCodeException(
          `코드가 일치하지 않습니다: expected=${this.code}, actual=${code}`,
        ),
      );
    }

    if (this.isExpired(now)) {
      return E.left(
        new ExpiredCodeException(
          `코드가 만료되었습니다: expiredAt=${this.expiredAt}`,
        ),
      );
    }

    return E.right(undefined);
  }

  private isExpired(now: Date): boolean {
    return isAfter(now, this.expiredAt);
  }
}
