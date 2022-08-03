export class HttpError extends Error {
  constructor(message: Error) {
    super(message.message);
    Error.captureStackTrace(this, this.constructor);
  }
}
