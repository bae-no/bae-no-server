import { BaseException } from '@app/domain/exception/BaseException';
import { ExceptionCode } from '@app/domain/exception/ExceptionCode';

export class NotFoundException extends BaseException {
  constructor(message: string) {
    super(message);
  }

  override readonly code = ExceptionCode.NOT_FOUND;
}
