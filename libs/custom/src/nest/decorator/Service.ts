import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';

export const SERVICE_METADATA = Symbol('Service');

export const Service = (): ClassDecorator =>
  applyDecorators(SetMetadata(SERVICE_METADATA, 'Service'), Injectable);
