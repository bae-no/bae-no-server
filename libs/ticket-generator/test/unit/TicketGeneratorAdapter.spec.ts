import { TicketGeneratorAdapter } from '@app/ticket-generator/TicketGeneratorAdapter';
import { Snowflake } from 'nodejs-snowflake';

describe('TicketGeneratorAdapter', () => {
  const ticketGeneratorAdapter = new TicketGeneratorAdapter(
    new Snowflake({ custom_epoch: 1_000_000_000_000, instance_id: 100 }),
  );

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
