import { BaseException } from '@app/domain/exception/BaseException';
import { Catch, ExceptionFilter } from '@nestjs/common';
import { ApolloError } from 'apollo-server-core';

@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter<BaseException> {
  catch(exception: BaseException): any {
    throw new ApolloError(exception.message, exception.code);
  }
}
