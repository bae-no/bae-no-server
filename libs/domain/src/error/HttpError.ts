export class HttpError extends Error {
  constructor(error: Error) {
    super(error.message);
    Error.captureStackTrace(this, this.constructor);
    (this.stack as any) += error.stack;
  }

  static fromMessage(message: string): HttpError {
    return new HttpError(new Error(message));
  }
}
