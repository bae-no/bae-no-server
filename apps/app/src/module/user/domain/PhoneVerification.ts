import { IllegalStateException } from '@app/domain/exception/IllegalStateException';
import { isAfter } from 'date-fns';

export class PhoneVerification {
  constructor(
    readonly phoneNumber: string,
    readonly code: string,
    readonly expiredAt: Date,
  ) {}

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
