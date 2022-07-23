import { Sample as OrmSample } from '@prisma/client';

import { Sample } from '../../../domain/Sample';

export class SampleOrmMapper {
  static toDomain(orm: OrmSample): Sample {
    return Sample.of({
      name: orm.name,
      email: orm.email,
    }).setBase(orm.id, orm.createdAt, orm.updatedAt);
  }

  static toOrm(domain: Sample): OrmSample {
    return {
      id: domain.id,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      name: domain.name,
      email: domain.email,
    };
  }
}
