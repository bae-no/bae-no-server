import { DBError, tryCatchDB } from '@app/domain/error/DBError';
import { O, TE } from '@app/external/fp-ts';
import { PrismaService } from '@app/prisma/PrismaService';
import { Injectable } from '@nestjs/common';
import { pipe } from 'fp-ts/function';
import { Option } from 'fp-ts/Option';
import { TaskEither } from 'fp-ts/TaskEither';

import { PhoneVerificationRepositoryPort } from '../../../application/port/out/PhoneVerificationRepositoryPort';
import { PhoneVerification } from '../../../domain/PhoneVerification';

@Injectable()
export class PhoneVerificationRepositoryAdapter extends PhoneVerificationRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override save(
    userId: string,
    phoneVerification: PhoneVerification,
  ): TaskEither<DBError, PhoneVerification> {
    return pipe(
      tryCatchDB(() =>
        this.prisma.phoneVerification.create({
          data: {
            code: phoneVerification.code,
            expiredAt: phoneVerification.expiredAt,
            phoneNumber: phoneVerification.phoneNumber,
            userId,
          },
        }),
      ),
      TE.map((data) =>
        PhoneVerification.of(data.phoneNumber, data.code, data.expiredAt),
      ),
    );
  }

  findLatest(userId: string): TaskEither<DBError, Option<PhoneVerification>> {
    return pipe(
      tryCatchDB(() =>
        this.prisma.phoneVerification.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        }),
      ),
      TE.map((data) =>
        pipe(
          O.fromNullable(data),
          O.map((phone) =>
            PhoneVerification.of(
              phone.phoneNumber,
              phone.code,
              phone.expiredAt,
            ),
          ),
        ),
      ),
    );
  }
}
