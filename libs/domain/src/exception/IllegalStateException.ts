import { BaseException } from '@app/domain/exception/BaseException';
import { ExceptionCode } from '@app/domain/exception/ExceptionCode';

export class IllegalStateException extends BaseException {
  constructor(message: string) {
    super(message);
  }

  override readonly code = ExceptionCode.ILLEGAL_STATE;
}
