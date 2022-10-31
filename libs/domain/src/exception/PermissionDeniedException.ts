import { BaseException } from '@app/domain/exception/BaseException';
import { ExceptionCode } from '@app/domain/exception/ExceptionCode';

export class PermissionDeniedException extends BaseException {
  override readonly code = ExceptionCode.PERMISSION_DENIED;

  constructor(message: string) {
    super(message);
  }
}
