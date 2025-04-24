/* eslint-disable @typescript-eslint/no-explicit-any */
export type SnakeToCamelCase<S extends string> =
  S extends `${infer T}_${infer U}`
    ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
    : S;

export type SnakeToCamelCaseNested<T> = T extends (...args: any[]) => any
  ? T
  : T extends Array<infer R>
    ? Array<SnakeToCamelCaseNested<R>>
    : T extends number | string
      ? T
      : T extends Date
        ? T
        : T extends Record<string, any>
          ? {
              [K in keyof T as SnakeToCamelCase<
                K & string
              >]: SnakeToCamelCaseNested<T[K]>;
            }
          : T;

export type CamelToSnakeCase<S extends string> =
  S extends `${infer First}${infer Rest}`
    ? `${First extends Uppercase<First>
        ? "_"
        : ""}${Lowercase<First>}${CamelToSnakeCase<Rest>}`
    : S;

export type CamelToSnakeCaseNested<T> = T extends (...args: any[]) => any
  ? T
  : T extends Array<infer R>
    ? Array<CamelToSnakeCaseNested<R>>
    : T extends number | string
      ? T
      : T extends Date
        ? T
        : T extends Record<string, any>
          ? {
              [K in keyof T as CamelToSnakeCase<
                K & string
              >]: CamelToSnakeCaseNested<T[K]>;
            }
          : T;
