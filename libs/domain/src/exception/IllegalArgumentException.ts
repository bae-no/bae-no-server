import { BaseException } from '@app/domain/exception/BaseException';
import { ExceptionCode } from '@app/domain/exception/ExceptionCode';

export class IllegalArgumentException extends BaseException {
  override readonly code = ExceptionCode.ILLEGAL_ARGUMENT;

  constructor(message: string) {
    super(message);
  }
}
