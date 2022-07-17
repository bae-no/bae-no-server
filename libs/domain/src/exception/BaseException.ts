export abstract class BaseException extends Error {
  protected constructor(message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }

  abstract code: string;
}
