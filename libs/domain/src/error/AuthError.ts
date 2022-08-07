export class AuthError extends Error {
  constructor(error: Error) {
    super(error.message);
    Error.captureStackTrace(this, this.constructor);
    (this.stack as any) += error.stack;
  }
}
