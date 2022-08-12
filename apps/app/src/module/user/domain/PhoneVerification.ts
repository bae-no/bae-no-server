import { IllegalStateException } from '@app/domain/exception/IllegalStateException';
import { addMinutes, isAfter } from 'date-fns';

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
      code ?? Math.floor(Math.random() * 10000).toString(),
      expiredAt ?? addMinutes(new Date(), PhoneVerification.EXPIRATION_MINUTES),
    );
  }

  verify(code: string, now = new Date()) {
    if (this.code !== code) {
      throw new IllegalStateException(
        `코드가 일치하지 않습니다: expected=${this.code}, actual=${code}`,
      );
    }

    if (this.isExpired(now)) {
      throw new IllegalStateException(
        `코드가 만료되었습니다: expiredAt=${this.expiredAt}`,
      );
    }
  }

  private isExpired(now: Date): boolean {
    return isAfter(now, this.expiredAt);
  }
}
