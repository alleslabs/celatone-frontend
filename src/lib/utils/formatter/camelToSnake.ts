import { Dayjs } from "dayjs";
import mapObject from "map-obj";
import { snakeCase } from "snake-case";

// Convert camel case to snake case of an object
// Todo - Might have to fix type
export const camelToSnake = (obj: unknown): unknown => {
  // Any falsy, which includes `null` whose typeof is `object`.
  if (!obj) {
    return obj;
  }

  // Ignore Dayjs, whose typeof is `object` too.
  if (obj instanceof Dayjs) {
    return obj;
  }

  // Array of object
  if (Array.isArray(obj)) {
    return obj.map((element) => {
      return camelToSnake(element);
    });
  }

  if (typeof obj === "object") {
    return mapObject(obj, (key, value) => {
      const newKey = snakeCase(key) || key;
      if (key !== newKey && newKey in obj) {
        throw new Error(
          `Snake case key ${newKey} would overwrite existing key of the given JSON object`
        );
      }
      return [newKey, camelToSnake(value)];
    });
  }
  // Something else like a String or Number.
  return obj;
};
