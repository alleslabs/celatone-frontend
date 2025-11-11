import type { BechAddr20 } from "lib/types";

import { Textarea } from "@chakra-ui/react";
import { useExampleAddresses } from "lib/app-provider";
import { bech32AddressToHex } from "lib/utils";
import { useState } from "react";

import type { ArgFieldWidgetProps } from "./types";

import {
  BIG_DECIMAL_TYPE,
  FIXED_POINT_TYPES,
  OBJECT_TYPE,
  STRING_TYPE,
  UINT_NUMBER_TYPES,
  UINT_STRING_TYPES,
} from "../constants";

const getVectorPlaceholder = (
  type: string,
  isNull: boolean,
  sampleAddress: BechAddr20
) => {
  if (isNull) return " ";
  const [, elementType] = type.split(/<(.*)>/);

  if (UINT_NUMBER_TYPES.includes(elementType)) return "[1, 2, 3]";
  if (UINT_STRING_TYPES.includes(elementType)) return '["1", "2", "3"]';
  if (elementType === "address" || elementType.startsWith(OBJECT_TYPE))
    return `["0x1", "${bech32AddressToHex(sampleAddress)}"]`;
  if (elementType === STRING_TYPE)
    return '["some first string", "some second string"]';
  if (elementType === "bool") return "[true, false]";
  if (
    FIXED_POINT_TYPES.includes(elementType) ||
    elementType === BIG_DECIMAL_TYPE
  )
    return '["1", "1.2", "1.23", "12.34"]';
  return `["${elementType}"]`;
};

export const JsonTextarea = ({
  onChange,
  type,
  value,
}: ArgFieldWidgetProps) => {
  const { user: exampleAddress } = useExampleAddresses();

  const [fieldValue, setFieldValue] = useState(
    typeof value === "string" ? value : JSON.stringify(value)
  );

  return (
    <Textarea
      h="fit-content"
      minH="112px"
      placeholder={
        type.startsWith("vector")
          ? getVectorPlaceholder(type, value === null, exampleAddress)
          : " "
      }
      value={fieldValue}
      onChange={(newValue) => {
        setFieldValue(newValue.target.value);
        try {
          onChange(JSON.parse(newValue.target.value));
        } catch {
          onChange(newValue.target.value);
        }
      }}
    />
  );
};
