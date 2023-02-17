import { BaseException } from '@app/domain/exception/BaseException';
import type { ExceptionFilter } from '@nestjs/common';
import { Catch } from '@nestjs/common';
import { ApolloError } from 'apollo-server-core';

@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter<BaseException> {
  catch(exception: BaseException): any {
    const error = new ApolloError(exception.message, exception.code);
    error.stack = exception.stack;
    throw error;
  }
}
