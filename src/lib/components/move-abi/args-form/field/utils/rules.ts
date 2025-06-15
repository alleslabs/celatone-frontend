import type { Nullable, Option } from "lib/types";
import type { FieldValues, UseControllerProps } from "react-hook-form";

import big from "big.js";
import { getArgType } from "lib/utils";
import { parseInt } from "lodash";

import {
  BIG_DECIMAL_TYPE,
  FIXED_POINT_TYPES,
  OBJECT_TYPE,
  UINT_NUMBER_TYPES,
  UINT_STRING_TYPES,
} from "../constants";

const validateNull = (v: Nullable<unknown>) =>
  v !== null ? undefined : "cannot be null";

const validateUintNumber = (uintType: string) => (v: unknown) => {
  try {
    if (typeof v !== "number") throw new Error();

    const value = big(v);
    const maxValue = big(2).pow(parseInt(uintType.slice(1)));
    if (value.lt(0) || value.gte(maxValue)) throw new Error();
    return undefined;
  } catch {
    return `Input must be ‘${uintType}’`;
  }
};

const validateUintString = (uintType: string) => (v: unknown) => {
  try {
    if (typeof v !== "string") throw new Error();

    const value = big(v);
    const maxValue = big(2).pow(parseInt(uintType.slice(1)));
    if (value.lt(0) || value.gte(maxValue)) throw new Error();
    return undefined;
  } catch {
    return `Input must be ‘${uintType}’`;
  }
};

const validateBool = (v: unknown) =>
  typeof v === "boolean" ? undefined : "Input must be ‘boolean’";

const validateAddress =
  (isValidArgAddress: (input: string) => boolean) => (v: unknown) =>
    typeof v === "string" && isValidArgAddress(v)
      ? undefined
      : "Invalid address";

const validateObject =
  (isValidArgObject: (input: string) => boolean) => (v: unknown) =>
    typeof v === "string" && isValidArgObject(v)
      ? undefined
      : "Invalid module address";

const validateFixedPoint = (bcsFixedPointType: string) => (v: unknown) => {
  try {
    if (typeof v !== "string") throw new Error();

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

const validateBigDecimal = (v: unknown) => {
  try {
    if (typeof v !== "string") throw new Error();

    const [, decimal] = v.split(".");
    if (decimal && decimal.length > 18)
      return "Decimal length must be less than 18";

    return undefined;
  } catch {
    return `Input must be ‘BigDecimal’`;
  }
};

const validateVector = (
  v: unknown,
  vectorType: string,
  isValidArgAddress: (input: string) => boolean,
  isValidArgObject: (input: string) => boolean
) => {
  try {
    if (!Array.isArray(v)) throw new Error();
    const [, elementType] = vectorType.split(/<(.*)>/);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let validateElement = (_v: unknown): Option<string> => undefined;
    if (UINT_NUMBER_TYPES.includes(elementType))
      validateElement = validateUintNumber(elementType);
    else if (UINT_STRING_TYPES.includes(elementType))
      validateElement = validateUintString(elementType);
    else if (elementType === "bool") validateElement = validateBool;
    else if (elementType === "address")
      validateElement = validateAddress(isValidArgAddress);
    else if (elementType.startsWith(OBJECT_TYPE))
      validateElement = validateAddress(isValidArgObject);
    else if (FIXED_POINT_TYPES.includes(elementType))
      validateElement = validateFixedPoint(getArgType(elementType));
    else if (elementType === BIG_DECIMAL_TYPE)
      validateElement = validateBigDecimal;
    // TODO: handle Vector?

    let error: Option<string>;
    v.forEach((elementValue) => {
      const err = validateElement(elementValue);
      if (err !== undefined) error = `Invalid element: ${err}`;
    });

    return error;
  } catch {
    return "Invalid vector format";
  }
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
  if (UINT_NUMBER_TYPES.includes(type))
    rules.validate = {
      ...rules.validate,
      [type]: (v: Nullable<string>) => {
        if (v === null) return undefined;
        return validateUintNumber(type)(v);
      },
    };
  if (UINT_STRING_TYPES.includes(type))
    rules.validate = {
      ...rules.validate,
      [type]: (v: Nullable<string>) => {
        if (v === null) return undefined;
        return validateUintNumber(type)(v);
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
  if (type === BIG_DECIMAL_TYPE) {
    const bcsType = getArgType(type);
    rules.validate = {
      ...rules.validate,
      [bcsType]: (v: Nullable<string>) => {
        if (v === null) return undefined;
        return validateBigDecimal(v);
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
