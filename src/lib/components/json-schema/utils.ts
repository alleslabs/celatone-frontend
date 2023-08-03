/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EnumOptionsType } from "@rjsf/utils";
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
export default function enumOptionsValueForIndex(
  valueIndex: string | number | Array<string | number>,
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
