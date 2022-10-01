export class PageCommand {
  constructor(readonly page = 0, readonly size = 10) {}

  get skip() {
    return this.page * this.size;
  }
}
