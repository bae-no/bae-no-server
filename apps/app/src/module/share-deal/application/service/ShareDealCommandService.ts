import { TE } from '@app/custom/fp-ts';
import type { DBError } from '@app/domain/error/DBError';
import { Injectable } from '@nestjs/common';
import { constVoid, pipe } from 'fp-ts/function';
import type { TaskEither } from 'fp-ts/TaskEither';

import type { JoinShareDealCommand } from '../port/in/dto/JoinShareDealCommand';
import type { LeaveShareDealCommand } from '../port/in/dto/LeaveShareDealCommand';
import type { OpenShareDealCommand } from '../port/in/dto/OpenShareDealCommand';
import type { StartShareDealCommand } from '../port/in/dto/StartShareDealCommand';
import type { UpdateShareDealCommand } from '../port/in/dto/UpdateShareDealCommand';
import type {
  JoinChatError,
  LeaveShareDealError,
  StartShareDealError,
  UpdateShareDealError,
} from '../port/in/ShareDealCommandUseCase';
import { ShareDealCommandUseCase } from '../port/in/ShareDealCommandUseCase';
import { ShareDealQueryRepositoryPort } from '../port/out/ShareDealQueryRepositoryPort';
import { ShareDealRepositoryPort } from '../port/out/ShareDealRepositoryPort';

@Injectable()
export class ShareDealCommandService extends ShareDealCommandUseCase {
  constructor(
    private readonly shareDealRepositoryPort: ShareDealRepositoryPort,
    private readonly shareDealQueryRepositoryPort: ShareDealQueryRepositoryPort,
  ) {
    super();
  }

  override open(command: OpenShareDealCommand): TaskEither<DBError, void> {
    return pipe(
      this.shareDealRepositoryPort.save(command.toDomain()),
      TE.map(constVoid),
    );
  }

  override join(
    command: JoinShareDealCommand,
  ): TaskEither<JoinChatError, void> {
    return pipe(
      this.shareDealQueryRepositoryPort.findById(command.shareDealId),
      TE.chainEitherKW((deal) => deal.join(command.userId)),
      TE.chainW((deal) => this.shareDealRepositoryPort.save(deal)),
      TE.map(constVoid),
    );
  }

  override start(
    command: StartShareDealCommand,
  ): TaskEither<StartShareDealError, void> {
    return pipe(
      this.shareDealQueryRepositoryPort.findById(command.shareDealId),
      TE.chainEitherKW((deal) => deal.start(command.userId)),
      TE.chainW((deal) => this.shareDealRepositoryPort.save(deal)),
      TE.map(constVoid),
    );
  }

  override end(
    command: StartShareDealCommand,
  ): TaskEither<StartShareDealError, void> {
    return pipe(
      this.shareDealQueryRepositoryPort.findById(command.shareDealId),
      TE.chainEitherKW((deal) => deal.end(command.userId)),
      TE.chainW((deal) => this.shareDealRepositoryPort.save(deal)),
      TE.map(constVoid),
    );
  }

  override update(
    command: UpdateShareDealCommand,
  ): TaskEither<UpdateShareDealError, void> {
    return pipe(
      this.shareDealQueryRepositoryPort.findById(command.shareDealId),
      TE.chainEitherKW((deal) =>
        deal.update(command.userId, command.toShareDealProps()),
      ),
      TE.chainW((deal) => this.shareDealRepositoryPort.save(deal)),
      TE.map(constVoid),
    );
  }

  leave(command: LeaveShareDealCommand): TaskEither<LeaveShareDealError, void> {
    return pipe(
      this.shareDealQueryRepositoryPort.findById(command.shareDealId),
      TE.chainEitherKW((deal) => deal.leave(command.userId)),
      TE.chainW((deal) => this.shareDealRepositoryPort.save(deal)),
      TE.map(constVoid),
    );
  }
}
