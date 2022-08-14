export abstract class BaseException extends Error {
  abstract code: string;

  protected constructor(message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}
