import { TE } from '@app/custom/fp-ts';
import { DBError, tryCatchDB } from '@app/domain/error/DBError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { PrismaService } from '@app/prisma/PrismaService';
import { Injectable } from '@nestjs/common';
import { pipe } from 'fp-ts/function';
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

  override findLatest(
    userId: string,
  ): TaskEither<DBError | NotFoundException, PhoneVerification> {
    return pipe(
      tryCatchDB(() =>
        this.prisma.phoneVerification.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        }),
      ),
      TE.chainW((data) =>
        data
          ? TE.right(
              PhoneVerification.of(data.phoneNumber, data.code, data.expiredAt),
            )
          : TE.left(
              new NotFoundException(
                `인증번호가 존재하지 않습니다: userId=${userId}`,
              ),
            ),
      ),
    );
  }
}
