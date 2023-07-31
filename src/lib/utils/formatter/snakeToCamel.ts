import camelCase from "camelcase";

import type { SnakeToCamelCaseNested } from "lib/types";

type Resolver<T> = T extends Array<infer U>
  ? SnakeToCamelCaseNested<U>[]
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>
  ? SnakeToCamelCaseNested<T>
  : T;

// Convert snake case to camel case of an object
export const snakeToCamel = <T>(obj: T): Resolver<T> => {
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
      return snakeToCamel(element);
    }) as Resolver<T>;
  }

  if (typeof obj === "object") {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const newKey = camelCase(key) || key;
        if (key !== newKey && newKey in obj) {
          throw new Error(
            `Camel case key ${newKey} would overwrite existing key of the given JSON object`
          );
        }
        acc[newKey as keyof SnakeToCamelCaseNested<T>] = snakeToCamel(value);
        return acc;
      }
      return acc;
    }, {} as SnakeToCamelCaseNested<T>) as Resolver<T>;
  }

  // Something else like a String or Number.
  return obj as Resolver<T>;
};
