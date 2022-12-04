import { CursorCommand } from '@app/domain/command/CursorCommand';

export class FindChatByUserCommand extends CursorCommand<number> {
  constructor(
    readonly shareDealId: string,
    readonly userId: string,
    readonly timestamp?: number,
    size?: number,
  ) {
    super(timestamp, size);
  }
}
