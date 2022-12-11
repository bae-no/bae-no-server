import { CursorCommand } from '@app/domain/command/CursorCommand';

export class FindChatByUserCommand extends CursorCommand<string> {
  constructor(
    readonly shareDealId: string,
    readonly userId: string,
    cursor?: string,
    size?: number,
  ) {
    super(cursor, size);
  }
}
