import { DBError } from '@app/domain/error/DBError';
import { TE } from '@app/external/fp-ts';
import { Injectable } from '@nestjs/common';
import { constVoid, pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { OpenShareDealCommand } from '../port/in/dto/OpenShareDealCommand';
import { ShareDealCommandUseCase } from '../port/in/ShareDealCommandUseCase';
import { ShareDealRepositoryPort } from '../port/out/ShareDealRepositoryPort';

@Injectable()
export class ShareDealCommandService extends ShareDealCommandUseCase {
  constructor(
    private readonly shareDealRepositoryPort: ShareDealRepositoryPort,
  ) {
    super();
  }

  override open(command: OpenShareDealCommand): TaskEither<DBError, void> {
    return pipe(
      this.shareDealRepositoryPort.save(command.toDomain()),
      TE.map(constVoid),
    );
  }
}
