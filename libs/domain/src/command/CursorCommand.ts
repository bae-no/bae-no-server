export class CursorCommand<T> {
  constructor(readonly cursor?: T, readonly size = 10) {}
}
