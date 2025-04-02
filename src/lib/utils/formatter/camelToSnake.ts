import type { CamelToSnakeCaseNested } from "lib/types";

import { snakeCase } from "snake-case";

type Resolver<T> =
  T extends Array<infer U>
    ? CamelToSnakeCaseNested<U>[]
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      T extends Record<string, any>
      ? CamelToSnakeCaseNested<T>
      : T;

// Convert camel case to snake case of an object
export const camelToSnake = <T>(obj: T): Resolver<T> => {
  // Any falsy, which includes `null` whose typeof is `object`.
  if (!obj) {
    return obj as Resolver<T>;
  }

  // Ignore Date, whose typeof is `object` too.
  if (obj instanceof Date) {
    return obj as Resolver<T>;
  }

  // Array of object
  if (Array.isArray(obj)) {
    return obj.map((element) => {
      return camelToSnake(element);
    }) as Resolver<T>;
  }

  if (typeof obj === "object") {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const newKey = snakeCase(key) || key;
        if (key !== newKey && newKey in obj) {
          throw new Error(
            `Snake case key ${newKey} would overwrite existing key of the given JSON object`
          );
        }
        // eslint-disable-next-line no-param-reassign
        acc[newKey as keyof CamelToSnakeCaseNested<T>] = camelToSnake(value);
        return acc;
      }
      return acc;
    }, {} as CamelToSnakeCaseNested<T>) as Resolver<T>;
  }
  // Something else like a String or Number.
  return obj as Resolver<T>;
};
