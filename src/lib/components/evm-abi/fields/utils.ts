import { big } from "lib/types";
import { is0x, isHex, isHex20Bytes, isHexFixedBytes } from "lib/utils";
import type { FieldValues, UseControllerProps } from "react-hook-form";

const validateAddress = (v: string) =>
  isHex20Bytes(v) ? undefined : "Invalid address";

const validateUint = (uintType: string) => (v: string) => {
  try {
    const value = big(v);
    const maxValue = big(2).pow(parseInt(uintType.slice(4)));
    if (value.lt(0) || value.gte(maxValue)) throw new Error();
    return undefined;
  } catch {
    return `Input must be ‘${uintType}’`;
  }
};

const validateInt = (intType: string) => (v: string) => {
  try {
    const value = big(v);
    const maxValue = big(2).pow(parseInt(intType.slice(3)) - 1);
    const minValue = maxValue.neg();
    if (value.lt(minValue) || value.gte(maxValue)) throw new Error();
    return undefined;
  } catch {
    return `Input must be ‘${intType}’`;
  }
};

const validateBytes = (bytesType: string) => (v: string) => {
  if (bytesType !== "bytes") {
    const length = 2 * parseInt(bytesType.slice(5));
    return isHexFixedBytes(v, length)
      ? undefined
      : `Input must be ‘${bytesType}’`;
  }

  return v.startsWith("0x") &&
    (is0x(v) || isHex(v.slice(2))) &&
    v.length % 2 === 0
    ? undefined
    : `Input must be ‘${bytesType}’`;
};

export const getRules = <T extends FieldValues>(
  type?: string,
  required = true
): UseControllerProps<T>["rules"] => {
  const rules: UseControllerProps<T>["rules"] = {
    required,
  };

  const baseTypeRegExp: RegExp = /(^.[^[]*)/g;
  const baseType = type?.match(baseTypeRegExp)?.[0];

  if (baseType === "address")
    rules.validate = {
      address: (v) => {
        if (!required && v.length === 0) return undefined;
        return validateAddress(v);
      },
    };
  else if (baseType?.startsWith("uint"))
    rules.validate = {
      [baseType]: (v) => {
        if (!required && v.length === 0) return undefined;
        return validateUint(baseType)(v);
      },
    };
  else if (baseType?.startsWith("int"))
    rules.validate = {
      [baseType]: (v) => {
        if (!required && v.length === 0) return undefined;
        return validateInt(baseType)(v);
      },
    };
  else if (baseType?.startsWith("bytes"))
    rules.validate = {
      [baseType]: (v) => {
        if (!required && v.length === 0) return undefined;
        return validateBytes(baseType)(v);
      },
    };

  return rules;
};
