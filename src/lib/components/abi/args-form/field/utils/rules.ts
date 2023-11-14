/* eslint-disable sonarjs/cognitive-complexity */
import big from "big.js";
import { parseInt } from "lodash";
import type { FieldValues, UseControllerProps } from "react-hook-form";

import {
  DECIMAL_TYPES,
  FIXED_POINT_TYPES,
  OBJECT_TYPE,
  UINT_TYPES,
} from "../constants";
import type { Nullable, Option } from "lib/types";
import { getArgType, getVectorElements } from "lib/utils";

const validateNull = (v: Option<string>) =>
  v !== null ? undefined : "cannot be null";

const validateUint = (uintType: string) => (v: string) => {
  try {
    const value = big(v);
    const maxValue = big(2).pow(parseInt(uintType.slice(1)));
    if (value.lt(0) || value.gte(maxValue)) throw new Error();
    return undefined;
  } catch {
    return `Input must be ‘${uintType}’`;
  }
};
const validateBool = (v: string) =>
  v.toLowerCase() === "true" || v.toLowerCase() === "false"
    ? undefined
    : "Input must be ‘boolean’";

const validateAddress =
  (isValidArgAddress: (input: string) => boolean) => (v: string) =>
    isValidArgAddress(v) ? undefined : "Invalid address";

const validateObject =
  (isValidArgObject: (input: string) => boolean) => (v: string) =>
    isValidArgObject(v) ? undefined : "Invalid module address";

const validateFixedPoint = (bcsFixedPointType: string) => (v: string) => {
  try {
    const div = big(2).pow(
      parseInt(bcsFixedPointType.slice("fixed_point".length))
    );
    const value = big(v).times(div);
    const maxValue = div.mul(div);
    if (value.lt(0) || value.gte(maxValue)) throw new Error();
    return undefined;
  } catch {
    return `Input must be ‘${bcsFixedPointType}’`;
  }
};

const validateDecimal = (bcsDecimalType: string) => (v: string) => {
  const [, decimal] = v.split(".");
  if (decimal && decimal.length > 18)
    return "Decimal length must be less than 18";
  try {
    const value = big(v).times(big(10).pow(18));
    const maxValue = big(2).pow(
      parseInt(bcsDecimalType.slice("decimal".length))
    );
    if (value.lt(0) || value.gte(maxValue)) throw new Error();
    return undefined;
  } catch {
    return `Input must be ‘${bcsDecimalType}’`;
  }
};

const validateVector = (
  v: string,
  vectorType: string,
  isValidArgAddress: (input: string) => boolean,
  isValidArgObject: (input: string) => boolean
) => {
  const value = v.trim();
  if (!value.startsWith("[") || !value.endsWith("]"))
    return "Input must be ‘vector’";

  const [, elementType] = vectorType.split(/<(.*)>/);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let validateElement = (_v: string): Option<string> => undefined;
  if (UINT_TYPES.includes(elementType))
    validateElement = validateUint(elementType);
  if (elementType === "bool") validateElement = validateBool;
  if (elementType === "address")
    validateElement = validateAddress(isValidArgAddress);
  if (elementType.startsWith(OBJECT_TYPE))
    validateElement = validateAddress(isValidArgObject);
  if (FIXED_POINT_TYPES.includes(elementType))
    validateElement = validateFixedPoint(getArgType(elementType));
  if (DECIMAL_TYPES.includes(elementType))
    validateElement = validateDecimal(getArgType(elementType));
  // TODO: handle Vector?

  let error: Option<string>;
  getVectorElements(value).forEach((elementValue) => {
    const res = validateElement(elementValue.trim());
    if (res !== undefined) error = `Invalid element: ${res}`;
  });

  return error;
};

export const getRules = <T extends FieldValues>(
  type: string,
  isOptional: boolean,
  isValidArgAddress: (input: string) => boolean,
  isValidArgObject: (input: string) => boolean
): UseControllerProps<T>["rules"] => {
  const rules: UseControllerProps<T>["rules"] = {};

  if (!isOptional) {
    rules.validate = {
      null: validateNull,
    };
  }
  if (UINT_TYPES.includes(type))
    rules.validate = {
      ...rules.validate,
      [type]: (v: Nullable<string>) => {
        if (v === null) return undefined;
        return validateUint(type)(v);
      },
    };
  if (type === "bool") {
    rules.validate = {
      ...rules.validate,
      bool: (v: Nullable<string>) => {
        if (v === null) return undefined;
        return validateBool(v);
      },
    };
  }
  if (type === "address") {
    rules.validate = {
      ...rules.validate,
      address: (v: Nullable<string>) => {
        if (v === null) return undefined;
        return validateAddress(isValidArgAddress)(v);
      },
    };
  }
  if (type.startsWith(OBJECT_TYPE)) {
    rules.validate = {
      ...rules.validate,
      object: (v: Nullable<string>) => {
        if (v === null) return undefined;
        return validateObject(isValidArgObject)(v);
      },
    };
  }
  if (FIXED_POINT_TYPES.includes(type)) {
    const bcsType = getArgType(type);
    rules.validate = {
      ...rules.validate,
      [bcsType]: (v: Nullable<string>) => {
        if (v === null) return undefined;
        return validateFixedPoint(bcsType)(v);
      },
    };
  }
  if (DECIMAL_TYPES.includes(type)) {
    const bcsType = getArgType(type);
    rules.validate = {
      ...rules.validate,
      [bcsType]: (v: Nullable<string>) => {
        if (v === null) return undefined;
        return validateDecimal(bcsType)(v);
      },
    };
  }
  if (type.startsWith("vector")) {
    rules.validate = {
      ...rules.validate,
      [type]: (v: Nullable<string>) => {
        if (v === null) return undefined;
        return validateVector(v, type, isValidArgAddress, isValidArgObject);
      },
    };
  }

  return rules;
};
