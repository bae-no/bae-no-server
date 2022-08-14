import { BaseException } from '@app/domain/exception/BaseException';
import { ExceptionCode } from '@app/domain/exception/ExceptionCode';

export class IllegalStateException extends BaseException {
  override readonly code = ExceptionCode.ILLEGAL_STATE;

  constructor(message: string) {
    super(message);
  }
}
