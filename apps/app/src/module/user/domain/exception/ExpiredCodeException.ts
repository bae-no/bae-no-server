import { BaseException } from '@app/domain/exception/BaseException';

export class ExpiredCodeException extends BaseException {
  override readonly code = 'EXPIRED_CODE';

  constructor(message: string) {
    super(message);
  }
}
