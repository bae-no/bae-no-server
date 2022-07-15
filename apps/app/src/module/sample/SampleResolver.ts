import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class SampleResolver {
  @Query(() => String)
  sample() {
    return 'hello world';
  }
}
