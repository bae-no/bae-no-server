import { IllegalStateException } from '@app/domain/exception/IllegalStateException';
import { addMinutes, isAfter } from 'date-fns';
import { Either, left, right } from 'fp-ts/Either';

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
      code ??
        Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, '0'),
      expiredAt ?? addMinutes(new Date(), PhoneVerification.EXPIRATION_MINUTES),
    );
  }

  verify(code: string, now = new Date()): Either<IllegalStateException, void> {
    if (this.code !== code) {
      return left(
        new IllegalStateException(
          `코드가 일치하지 않습니다: expected=${this.code}, actual=${code}`,
        ),
      );
    }

    if (this.isExpired(now)) {
      return left(
        new IllegalStateException(
          `코드가 만료되었습니다: expiredAt=${this.expiredAt}`,
        ),
      );
    }

    return right(undefined);
  }

  private isExpired(now: Date): boolean {
    return isAfter(now, this.expiredAt);
  }
}
