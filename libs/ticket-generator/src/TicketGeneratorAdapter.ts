import { TicketGeneratorPort } from '@app/domain/generator/TicketGeneratorPort';
import { Snowflake } from 'nodejs-snowflake';

export class TicketGeneratorAdapter extends TicketGeneratorPort {
  constructor(private generator: Snowflake) {
    super();
  }

  override generateId(): bigint {
    return this.generator.getUniqueID().valueOf();
  }
}
