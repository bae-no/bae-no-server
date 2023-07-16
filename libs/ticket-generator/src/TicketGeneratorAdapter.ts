import { TicketGeneratorPort } from '@app/domain/generator/TicketGeneratorPort';
import { monotonicFactory } from 'ulid';

export class TicketGeneratorAdapter extends TicketGeneratorPort {
  #generator = monotonicFactory();

  override generateId(): string {
    return this.#generator();
  }
}
