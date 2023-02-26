import { T, pipe } from '@app/custom/effect';
import { Repository } from '@app/custom/nest/decorator/Repository';
import type { DBError } from '@app/domain/error/DBError';
import { tryCatchDBE } from '@app/domain/error/DBError';
import { NotFoundException } from '@app/domain/exception/NotFoundException';
import { PrismaService } from '@app/prisma/PrismaService';

import { PhoneVerificationRepositoryPort } from '../../../application/port/out/PhoneVerificationRepositoryPort';
import { PhoneVerification } from '../../../domain/PhoneVerification';
import type { UserId } from '../../../domain/User';

@Repository()
export class PhoneVerificationRepositoryAdapter extends PhoneVerificationRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  override save(
    userId: UserId,
    phoneVerification: PhoneVerification,
  ): T.IO<DBError, PhoneVerification> {
    return pipe(
      tryCatchDBE(() =>
        this.prisma.phoneVerification.create({
          data: {
            code: phoneVerification.code,
            expiredAt: phoneVerification.expiredAt,
            phoneNumber: phoneVerification.phoneNumber,
            userId,
          },
        }),
      ),
      T.map((data) =>
        PhoneVerification.of(data.phoneNumber, data.code, data.expiredAt),
      ),
    );
  }

  override findLatest(
    userId: UserId,
  ): T.IO<DBError | NotFoundException, PhoneVerification> {
    return pipe(
      tryCatchDBE(() =>
        this.prisma.phoneVerification.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        }),
      ),
      T.chain((data) =>
        data
          ? T.succeed(
              PhoneVerification.of(data.phoneNumber, data.code, data.expiredAt),
            )
          : T.fail(
              new NotFoundException(
                `인증번호가 존재하지 않습니다: userId=${userId}`,
              ),
            ),
      ),
    );
  }
}
