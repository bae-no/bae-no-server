import { BaseException } from '@app/domain/exception/BaseException';
import { ExceptionCode } from '@app/domain/exception/ExceptionCode';

export class NotFoundException extends BaseException {
  override readonly code = ExceptionCode.NOT_FOUND;

  constructor(message: string) {
    super(message);
  }
}
