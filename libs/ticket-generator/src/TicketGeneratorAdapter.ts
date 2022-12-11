import { TicketGeneratorPort } from '@app/domain/generator/TicketGeneratorPort';
import * as cuid from 'cuid';

export class TicketGeneratorAdapter extends TicketGeneratorPort {
  constructor() {
    super();
  }

  override generateId(): string {
    return cuid();
  }
}
