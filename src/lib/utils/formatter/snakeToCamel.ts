import camelCase from "camelcase";
import mapObject from "map-obj";

// Convert snake case to camel case of an object
// Todo - Might have to fix type
export const snakeToCamel = (obj: unknown): unknown => {
  // Any falsy, which includes `null` whose typeof is `object`.
  if (!obj) {
    return obj;
  }

  // Ignore Date, whose typeof is `object` too.
  if (obj instanceof Date) {
    return obj;
  }
  // Array of object
  if (Array.isArray(obj)) {
    return obj.map((element) => {
      return snakeToCamel(element);
    });
  }

  if (typeof obj === "object") {
    return mapObject(obj, (key, value) => {
      const newKey = camelCase(key) || key;
      if (key !== newKey && newKey in obj) {
        throw new Error(
          `Snake case key ${newKey} would overwrite existing key of the given JSON object`
        );
      }
      return [newKey, snakeToCamel(value)];
    });
  }

  // Something else like a String or Number.
  return obj;
};
