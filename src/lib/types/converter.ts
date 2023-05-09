export type SnakeToCamelCase<S extends string> =
  S extends `${infer T}_${infer U}`
    ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
    : S;

export type SnakeToCamelCaseNested<T> = T extends object
  ? {
      [K in keyof T as SnakeToCamelCase<K & string>]: T[K] extends Array<
        infer R
      >
        ? Array<SnakeToCamelCaseNested<R>>
        : SnakeToCamelCaseNested<T[K]>;
    }
  : T;
