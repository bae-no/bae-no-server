import { BaseException } from '@app/domain/exception/BaseException';
import type { ExceptionFilter } from '@nestjs/common';
import { Catch } from '@nestjs/common';
import { GraphQLError } from 'graphql/error';

@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter<BaseException> {
  catch(exception: BaseException): any {
    const error = new GraphQLError(exception.message, {
      extensions: { code: exception.code },
    });
    error.stack = exception.stack;
    throw error;
  }
}
