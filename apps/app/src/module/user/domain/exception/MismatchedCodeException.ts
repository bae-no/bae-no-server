import { BaseException } from '@app/domain/exception/BaseException';

export class MismatchedCodeException extends BaseException {
  override readonly code = 'MISMATCHED_CODE';

  constructor(message: string) {
    super(message);
  }
}
