import { TicketGeneratorPort } from '@app/domain/generator/TicketGeneratorPort';
import { TicketGeneratorAdapter } from '@app/ticket-generator/TicketGeneratorAdapter';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: TicketGeneratorPort,
      useClass: TicketGeneratorAdapter,
    },
  ],
  exports: [TicketGeneratorPort],
})
export class TicketGeneratorModule {}
