export type Branded<T, B extends string> = T & { __brand: B };
