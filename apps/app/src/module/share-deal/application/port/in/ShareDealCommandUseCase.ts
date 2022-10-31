import { DBError } from '@app/domain/error/DBError';
import { IllegalStateException } from '@app/domain/exception/IllegalStateException';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { TaskEither } from 'fp-ts/TaskEither';

import { JoinShareDealCommand } from './dto/JoinShareDealCommand';
import { OpenShareDealCommand } from './dto/OpenShareDealCommand';
import { StartShareDealCommand } from './dto/StartShareDealCommand';
import { NotJoinableShareDealException } from './exception/NotJoinableShareDealException';

export type JoinChatError =
  | DBError
  | NotFoundException
  | NotJoinableShareDealException;

export type StartShareDealError =
  | DBError
  | NotFoundException
  | IllegalStateException;

export abstract class ShareDealCommandUseCase {
  abstract open(command: OpenShareDealCommand): TaskEither<DBError, void>;

  abstract join(command: JoinShareDealCommand): TaskEither<JoinChatError, void>;

  abstract start(
    command: StartShareDealCommand,
  ): TaskEither<StartShareDealError, void>;
}
