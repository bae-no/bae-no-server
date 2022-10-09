import { TE } from '@app/custom/fp-ts';
import { DBError } from '@app/domain/error/DBError';
import { Injectable } from '@nestjs/common';
import { constVoid, pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { JoinChatCommand } from '../port/in/dto/JoinChatCommand';
import { OpenShareDealCommand } from '../port/in/dto/OpenShareDealCommand';
import { NotOpenShareDealException } from '../port/in/exception/NotOpenShareDealException';
import {
  JoinChatError,
  ShareDealCommandUseCase,
} from '../port/in/ShareDealCommandUseCase';
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

  override join(command: JoinChatCommand): TaskEither<JoinChatError, void> {
    return pipe(
      this.shareDealQueryRepositoryPort.findById(command.shareDealId),
      TE.filterOrElseW(
        (deal) => deal.isJoinable,
        () => new NotOpenShareDealException('입장 가능한 공유딜이 아닙니다.'),
      ),
      TE.chain((deal) => this.shareDealRepositoryPort.save(deal)),
      TE.map(constVoid),
    );
  }
}
