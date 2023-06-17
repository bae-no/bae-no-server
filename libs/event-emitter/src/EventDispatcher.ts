import type { DomainEvent } from '@app/domain/event/DomainEvent';
import type { Constructor } from '@app/event-emitter/decorator/OnDomainEvent';
import { EVENTS_METADATA } from '@app/event-emitter/decorator/OnDomainEvent';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import type { OnModuleInit } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import type { Job } from 'bullmq';
import { plainToInstance } from 'class-transformer';

@Injectable()
@Processor('event-emitter')
export class EventDispatcher extends WorkerHost implements OnModuleInit {
  private readonly logger = new Logger(EventDispatcher.name);
  private readonly eventProcessorMap: Map<
    string,
    { instance: any; methodName: string; domainClass: Constructor<DomainEvent> }
  > = new Map();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {
    super();
  }

  onModuleInit() {
    this.discoveryService
      .getProviders()
      .filter((wrapper) => !!wrapper.metatype?.prototype)
      .forEach(({ instance, metatype }) =>
        this.metadataScanner
          .getAllMethodNames(metatype.prototype)
          .forEach((methodName: string) => {
            const classes: Constructor<DomainEvent>[] =
              Reflect.getMetadata(
                EVENTS_METADATA,
                metatype.prototype,
                methodName,
              ) ?? [];

            classes.forEach((cls) => {
              this.eventProcessorMap.set(cls.name, {
                instance,
                methodName: methodName,
                domainClass: cls,
              });
            });
          }),
      );
  }

  override async process(job: Job): Promise<any> {
    const item = this.eventProcessorMap.get(job.name);

    if (!item) {
      return;
    }

    item.instance[item.methodName](
      plainToInstance(item.domainClass, job.data),
    ).catch((e: unknown) =>
      this.logger.error(
        `Error while processing event ${job.name} with data ${JSON.stringify(
          job.data,
        )}`,
        e,
      ),
    );
  }
}
