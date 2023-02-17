import type { DBError } from '@app/domain/error/DBError';
import type { IllegalStateException } from '@app/domain/exception/IllegalStateException';
import type { NotFoundException } from '@app/domain/exception/NotFoundException';
import type { TaskEither } from 'fp-ts/TaskEither';

import type { EndShareDealCommand } from './dto/EndShareDealCommand';
import type { JoinShareDealCommand } from './dto/JoinShareDealCommand';
import type { LeaveShareDealCommand } from './dto/LeaveShareDealCommand';
import type { OpenShareDealCommand } from './dto/OpenShareDealCommand';
import type { StartShareDealCommand } from './dto/StartShareDealCommand';
import type { UpdateShareDealCommand } from './dto/UpdateShareDealCommand';
import type { NotJoinableShareDealException } from './exception/NotJoinableShareDealException';

export type JoinChatError =
  | DBError
  | NotFoundException
  | NotJoinableShareDealException;

export type StartShareDealError =
  | DBError
  | NotFoundException
  | IllegalStateException;

export type EndShareDealError =
  | DBError
  | NotFoundException
  | IllegalStateException;

export type UpdateShareDealError =
  | DBError
  | NotFoundException
  | IllegalStateException;

export type LeaveShareDealError =
  | DBError
  | NotFoundException
  | IllegalStateException;

export abstract class ShareDealCommandUseCase {
  abstract open(command: OpenShareDealCommand): TaskEither<DBError, void>;

  abstract join(command: JoinShareDealCommand): TaskEither<JoinChatError, void>;

  abstract start(
    command: StartShareDealCommand,
  ): TaskEither<StartShareDealError, void>;

  abstract end(
    command: EndShareDealCommand,
  ): TaskEither<EndShareDealError, void>;

  abstract update(
    command: UpdateShareDealCommand,
  ): TaskEither<UpdateShareDealError, void>;

  abstract leave(
    command: LeaveShareDealCommand,
  ): TaskEither<LeaveShareDealError, void>;
}
