/* eslint-disable perfectionist/sort-modules */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EnumOptionsType, RJSFSchema, ValidatorType } from "@rjsf/utils";
import isEqual from "lodash/isEqual";

/** Determines whether the given `value` is (one of) the `selected` value(s).
 *
 * @param value - The value being checked to see if it is selected
 * @param selected - The current selected value or list of values
 * @returns - true if the `value` is one of the `selected` ones, false otherwise
 */
export function enumOptionsIsSelected(
  value: EnumOptionsType["value"],
  selected: EnumOptionsType["value"] | EnumOptionsType["value"][]
) {
  if (Array.isArray(selected)) {
    return selected.some((sel) => isEqual(sel, value));
  }
  return isEqual(selected, value);
}

/** Returns the index(es) of the options in `allEnumOptions` whose value(s) match the ones in `value`. All the
 * `enumOptions` are filtered based on whether they are a "selected" `value` and the index of each selected one is then
 * stored in an array. If `multiple` is true, that array is returned, otherwise the first element in the array is
 * returned.
 *
 * @param value - The single value or list of values for which indexes are desired
 * @param [allEnumOptions=[]] - The list of all the known enumOptions
 * @param [multiple=false] - Optional flag, if true will return a list of index, otherwise a single one
 * @returns - A single string index for the first `value` in `allEnumOptions`, if not `multiple`. Otherwise, the list
 *        of indexes for (each of) the value(s) in `value`.
 */
export function enumOptionsIndexForValue(
  value: EnumOptionsType["value"] | EnumOptionsType["value"][],
  allEnumOptions: EnumOptionsType[] = [],
  multiple = false
): string | string[] | undefined {
  const selectedIndexes: string[] = allEnumOptions
    .map((opt, index) =>
      enumOptionsIsSelected(opt.value, value) ? String(index) : undefined
    )
    .filter((opt) => typeof opt !== "undefined") as string[];
  if (!multiple) {
    return selectedIndexes[0];
  }
  return selectedIndexes;
}

/** Returns the value(s) from `allEnumOptions` at the index(es) provided by `valueIndex`. If `valueIndex` is not an
 * array AND the index is not valid for `allEnumOptions`, `emptyValue` is returned. If `valueIndex` is an array, AND it
 * contains an invalid index, the returned array will have the resulting undefined values filtered out, leaving only
 * valid values or in the worst case, an empty array.
 *
 * @param valueIndex - The index(es) of the value(s) that should be returned
 * @param [allEnumOptions=[]] - The list of all the known enumOptions
 * @param [emptyValue] - The value to return when the non-array `valueIndex` does not refer to a real option
 * @returns - The single or list of values specified by the single or list of indexes if they are valid. Otherwise,
 *        `emptyValue` or an empty list.
 */
export function enumOptionsValueForIndex(
  valueIndex: Array<number | string> | number | string,
  allEnumOptions: EnumOptionsType[] = [],
  emptyValue?: EnumOptionsType["value"]
): EnumOptionsType["value"] | EnumOptionsType["value"][] | undefined {
  if (Array.isArray(valueIndex)) {
    return valueIndex
      .map((index) => enumOptionsValueForIndex(index, allEnumOptions))
      .filter((val) => val);
  }
  // So Number(null) and Number('') both return 0, so use emptyValue for those two values
  const index =
    valueIndex === "" || valueIndex === null ? -1 : Number(valueIndex);
  const option = allEnumOptions[index];
  return option ? option.value : emptyValue;
}

/** Given the `formData` and list of `options`, attempts to find the index of the option that best matches the data.
 *
 * @param validator - An implementation of the `ValidatorType` interface that will be used when necessary
 * @param formData - The current formData, if any, used to figure out a match
 * @param options - The list of options to find a matching options from
 * @param rootSchema - The root schema, used to primarily to look up `$ref`s
 * @returns - The index of the matched option or 0 if none is available
 */
export function getMatchingOptionFixed<T = any>(
  validator: ValidatorType,
  formData: T | undefined,
  options: RJSFSchema[],
  rootSchema: RJSFSchema
): number {
  // For performance, skip validating subschemas if formData is undefined. We just
  // want to get the first option in that case.
  if (formData === undefined) {
    return -1;
  }
  return options.findIndex((option) => {
    // If the schema describes an object then we need to add slightly more
    // strict matching to the schema, because unless the schema uses the
    // "requires" keyword, an object will match the schema as long as it
    // doesn't have matching keys with a conflicting type. To do this we use an
    // "anyOf" with an array of requires. This augmentation expresses that the
    // schema should match if any of the keys in the schema are present on the
    // object and pass validation.
    if (option.properties) {
      // Create an "anyOf" schema that requires at least one of the keys in the
      // "properties" object
      const requiresAnyOf = {
        anyOf: Object.keys(option.properties).map((key) => ({
          required: [key],
        })),
      };

      let augmentedSchema;
      // If the "anyOf" keyword already exists, wrap the augmentation in an "allOf"
      if (option.anyOf) {
        // Create a shallow clone of the option
        const { ...shallowClone } = option;

        if (!shallowClone.allOf) {
          shallowClone.allOf = [];
        } else {
          // If "allOf" already exists, shallow clone the array
          shallowClone.allOf = shallowClone.allOf.slice();
        }

        shallowClone.allOf.push(requiresAnyOf);

        augmentedSchema = shallowClone;
      } else {
        augmentedSchema = { ...option, ...requiresAnyOf };
      }

      // Remove the "required" field as it's likely that not all fields have
      // been filled in yet, which will mean that the schema is not valid
      delete augmentedSchema.required;

      return validator.isValid(augmentedSchema, formData, rootSchema);
    }
    return validator.isValid(option, formData, rootSchema);
  });
}

export const isNullFormData = <T = any>(formData: T): boolean =>
  formData === undefined || formData === null;

export const isSchemaTypeString = (type: RJSFSchema["type"]) =>
  (typeof type === "string" && type === "string") ||
  (Array.isArray(type) && type.includes("string"));
