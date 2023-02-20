import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';

export const REPOSITORY_METADATA = Symbol('Repository');

export const Repository = (): ClassDecorator =>
  applyDecorators(SetMetadata(REPOSITORY_METADATA, 'Repository'), Injectable);
