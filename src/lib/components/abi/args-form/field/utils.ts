/* eslint-disable sonarjs/cognitive-complexity */
import { parseInt } from "lodash";
import type { FieldValues, UseControllerProps } from "react-hook-form";

import type { Option } from "lib/types";

export const UintTypes = ["u8", "u16", "u32", "u64", "u128", "u256"];

const validateNull = (v: Option<string>) =>
  v !== undefined ? undefined : "cannot be null";

const validateUint = (uintType: string) => (v: string) => {
  const value = parseInt(v);
  const maxValue = 2 ** parseInt(uintType.slice(1)) - 1;
  return value >= 0 && value <= maxValue
    ? undefined
    : `Input must be ‘${uintType}’`;
};
const validateBool = (v: string) =>
  v === "true" || v === "false" ? undefined : "Input must be ‘boolean’";

const validateAddress =
  (isValidArgAddress: (input: string) => boolean) => (v: string) =>
    isValidArgAddress(v) ? undefined : "invalid address";

const validateVector = (
  v: string,
  vectorType: string,
  isValidArgAddress: (input: string) => boolean
) => {
  const value = v.trim();
  if (!value.startsWith("[") || !value.endsWith("]"))
    return "Input must be ‘vector’";

  const [, elementType] = vectorType.split(/<(.*)>/);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let validateElement = (_v: string): Option<string> => undefined;
  if (UintTypes.includes(elementType))
    validateElement = validateUint(elementType);
  if (elementType === "bool") validateElement = validateBool;
  if (elementType === "address")
    validateElement = validateAddress(isValidArgAddress);
  // TODO: handle Vector?

  let error: Option<string>;
  value.split(",").forEach((elementValue) => {
    const res = validateElement(elementValue);
    if (res !== undefined) error = `invalid element: ${res}`;
  });

  return error;
};

export const getRules = <T extends FieldValues>(
  type: string,
  isOptional: boolean,
  isValidArgAddress: (input: string) => boolean
): UseControllerProps<T>["rules"] => {
  const rules: UseControllerProps<T>["rules"] = {};

  if (!isOptional) {
    rules.validate = {
      null: validateNull,
    };
  }
  if (UintTypes.includes(type))
    rules.validate = {
      ...rules.validate,
      [type]: (v: Option<string>) => {
        if (v === undefined) return undefined;
        return validateUint(type)(v);
      },
    };
  if (type === "bool") {
    rules.validate = {
      ...rules.validate,
      bool: (v: Option<string>) => {
        if (v === undefined) return undefined;
        return validateBool(v);
      },
    };
  }
  if (type === "address") {
    rules.validate = {
      ...rules.validate,
      address: (v: Option<string>) => {
        if (v === undefined) return undefined;
        return validateAddress(isValidArgAddress)(v);
      },
    };
  }
  if (type.startsWith("vector")) {
    rules.validate = {
      ...rules.validate,
      [type]: (v: Option<string>) => {
        if (v === undefined) return undefined;
        return validateVector(v, type, isValidArgAddress);
      },
    };
  }

  return rules;
};
