import { OT, T } from '@app/custom/effect';
import { REPOSITORY_METADATA } from '@app/custom/nest/decorator/Repository';
import { SERVICE_METADATA } from '@app/custom/nest/decorator/Service';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import {
  DiscoveryModule,
  DiscoveryService,
  MetadataScanner,
} from '@nestjs/core';
import type { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { RESOLVER_TYPE_METADATA } from '@nestjs/graphql';

@Module({
  imports: [DiscoveryModule],
})
export class OTELModule implements OnModuleInit {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  onModuleInit() {
    this.getProviders().forEach((provider) => {
      const instance = provider.instance;
      const prototype = Object.getPrototypeOf(instance);
      const methods = this.metadataScanner.getAllMethodNames(prototype);

      methods.forEach((method) => {
        const spanName = `${provider.name}.${method}`;

        prototype[method] = this.wrap(prototype[method], spanName);
      });
    });
  }

  private getProviders(): InstanceWrapper[] {
    return this.discoveryService
      .getProviders()
      .filter((provider) => this.isSpanTarget(provider));
  }

  private isSpanTarget(wrapper: InstanceWrapper): boolean {
    return (
      wrapper.metatype &&
      (Reflect.hasMetadata(REPOSITORY_METADATA, wrapper.metatype as any) ||
        Reflect.hasMetadata(RESOLVER_TYPE_METADATA, wrapper.metatype as any) ||
        Reflect.hasMetadata(SERVICE_METADATA, wrapper.metatype as any))
    );
  }

  private wrap(prototype: Record<any, any>, spanName: string) {
    const method = {
      // To keep function.name property
      [prototype.name]: function (...args: any[]) {
        const value = prototype.apply(this, args);

        if (value instanceof T.Base) {
          return OT.withSpan(spanName)(value);
        }

        return value;
      },
    }[prototype.name];

    // Copy existing metadata
    const source = prototype;
    Reflect.getMetadataKeys(source).forEach((key) => {
      const meta = Reflect.getMetadata(key, source);
      Reflect.defineMetadata(key, meta, method as any);
    });

    return method;
  }
}
