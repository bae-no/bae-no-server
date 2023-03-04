import { TicketGeneratorAdapter } from '@app/ticket-generator/TicketGeneratorAdapter';
import { describe, expect, it } from 'vitest';

describe('TicketGeneratorAdapter', () => {
  const ticketGeneratorAdapter = new TicketGeneratorAdapter();

  it('순서가 보장되는 유일한 id를 생성한다', () => {
    // given
    const ids = Array.from({ length: 1000 }, () =>
      ticketGeneratorAdapter.generateId(),
    );

    // then
    const result = new Set(ids);

    // then
    expect(result.size).toBe(1000);
    expect(ids).toEqual([...result].sort());
  });
});
