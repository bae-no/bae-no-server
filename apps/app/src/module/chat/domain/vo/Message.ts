export class Message {
  private constructor(
    readonly authorId: string,
    readonly content: string,
    readonly createdAt: Date,
  ) {}

  static of(authorId: string, content: string, now = new Date()): Message {
    return new Message(authorId, content, now);
  }
}
