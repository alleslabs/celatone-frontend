/* eslint-disable no-use-before-define */
import { JsonFragmentType } from "ethers";
import { JsonDataType, Option } from "lib/types";
import { isPositiveInt } from "lib/utils";

export const getTypeDimensions = (type = "") => {
  const dimensionRegExp: RegExp = /(?<=\[)(\d*)(?=\])/g;
  return (type.match(dimensionRegExp) ?? []).map((val) =>
    isPositiveInt(val) ? Number(val) : undefined
  );
};

export function getDefaultValueFromDimensions(
  dimensions: Option<number>[],
  components?: ReadonlyArray<JsonFragmentType>
): JsonDataType {
  if (dimensions.length === 0) return getFieldDefaultValue(components);
  if (dimensions[0] === undefined) return [];

  return Array(dimensions[0]).fill(
    getDefaultValueFromDimensions(dimensions.slice(1), components)
  );
}

export function getComponentsDefaultValues(
  components: ReadonlyArray<JsonFragmentType>
) {
  return (
    components.map((type) => {
      const dimensions = getTypeDimensions(type.type);
      return getDefaultValueFromDimensions(dimensions, type.components);
    }) ?? []
  );
}

export function getFieldDefaultValue(
  components?: ReadonlyArray<JsonFragmentType>
) {
  if (!components) return "";
  return getComponentsDefaultValues(components);
}
