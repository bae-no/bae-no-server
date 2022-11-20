import { TE } from '@app/custom/fp-ts';
import { DBError } from '@app/domain/error/DBError';
import { EventEmitterPort } from '@app/domain/event-emitter/EventEmitterPort';
import { IllegalStateException } from '@app/domain/exception/IllegalStateException';
import { Injectable } from '@nestjs/common';
import { constVoid, pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { ShareDealStartedEvent } from '../../domain/event/ShareDealStartedEvent';
import { JoinShareDealCommand } from '../port/in/dto/JoinShareDealCommand';
import { OpenShareDealCommand } from '../port/in/dto/OpenShareDealCommand';
import { StartShareDealCommand } from '../port/in/dto/StartShareDealCommand';
import { NotJoinableShareDealException } from '../port/in/exception/NotJoinableShareDealException';
import {
  JoinChatError,
  ShareDealCommandUseCase,
  StartShareDealError,
} from '../port/in/ShareDealCommandUseCase';
import { ShareDealQueryRepositoryPort } from '../port/out/ShareDealQueryRepositoryPort';
import { ShareDealRepositoryPort } from '../port/out/ShareDealRepositoryPort';

@Injectable()
export class ShareDealCommandService extends ShareDealCommandUseCase {
  constructor(
    private readonly shareDealRepositoryPort: ShareDealRepositoryPort,
    private readonly shareDealQueryRepositoryPort: ShareDealQueryRepositoryPort,
    private readonly eventEmitterPort: EventEmitterPort,
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
      TE.filterOrElseW(
        (deal) => deal.isJoinable,
        () =>
          new NotJoinableShareDealException('입장 가능한 공유딜이 아닙니다.'),
      ),
      TE.map((deal) => deal.join(command.userId)),
      TE.chainW((deal) => this.shareDealRepositoryPort.save(deal)),
      TE.map(constVoid),
    );
  }

  override start(
    command: StartShareDealCommand,
  ): TaskEither<StartShareDealError, void> {
    return pipe(
      this.shareDealQueryRepositoryPort.findById(command.shareDealId),
      TE.filterOrElseW(
        (deal) => deal.canStart(command.userId),
        () => new IllegalStateException('입장 가능한 공유딜이 아닙니다.'),
      ),
      TE.map((deal) => deal.start()),
      TE.chainW((deal) => this.shareDealRepositoryPort.save(deal)),
      TE.map(() =>
        this.eventEmitterPort.emit(
          ShareDealStartedEvent.EVENT_NAME,
          new ShareDealStartedEvent(command.shareDealId),
        ),
      ),
      TE.map(constVoid),
    );
  }
}
