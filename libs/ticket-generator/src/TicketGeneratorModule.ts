import { TicketGeneratorPort } from '@app/domain/generator/TicketGeneratorPort';
import { TicketGeneratorAdapter } from '@app/ticket-generator/TicketGeneratorAdapter';
import { Module } from '@nestjs/common';
import { Snowflake } from 'nodejs-snowflake';

@Module({
  providers: [
    {
      provide: TicketGeneratorPort,
      useFactory: () =>
        new TicketGeneratorAdapter(new Snowflake({ instance_id: 100 })),
    },
  ],
  exports: [TicketGeneratorPort],
})
export class TicketGeneratorModule {}
