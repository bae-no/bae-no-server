import { AuthError } from '@app/domain/error/AuthError';
import { HttpError } from '@app/domain/error/HttpError';
import { TE } from '@app/domain/fp-ts';
import { HttpClientPort } from '@app/domain/http/HttpClientPort';
import { HttpResponse } from '@app/domain/http/HttpResponse';
import { ConfigService } from '@nestjs/config';
import { pipe } from 'fp-ts/function';
import { TaskEither } from 'fp-ts/TaskEither';

import { Auth } from '../../../../domain/Auth';

export abstract class AuthStrategy<T, S> {
  protected constructor(
    protected readonly httpClientPort: HttpClientPort,
    protected readonly config: ConfigService,
  ) {}

  request(code: string): TaskEither<AuthError, Auth> {
    return pipe(
      this.requestSocialId(code),
      TE.map((response) => this.toSocialResponse(response)),
      TE.chain((authResponse) => this.requestProfile(authResponse)),
      TE.map((response) => this.toProfileResponse(response)),
      TE.bimap(
        (error) => new AuthError(error),
        (response) => this.toAuth(response),
      ),
    );
  }

  protected abstract requestSocialId(
    code: string,
  ): TaskEither<HttpError, HttpResponse>;
  protected abstract toSocialResponse(response: HttpResponse): T;
  protected abstract requestProfile(
    authResponse: T,
  ): TaskEither<HttpError, HttpResponse>;
  protected abstract toProfileResponse(response: HttpResponse): S;
  protected abstract toAuth(response: S): Auth;
}
