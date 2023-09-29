import type { ContractState, DecodedKey } from "lib/types";

const nameRegex = /^[a-zA-Z0-9_]+$/;

export const hexToString = (hex: string) =>
  Buffer.from(hex, "hex").toString("utf-8");

export const parseKey = (key: string): DecodedKey => {
  try {
    const decodedStr = hexToString(key);
    if (decodedStr === "") throw new Error("Invalid hex string for decoding");
    if (nameRegex.test(decodedStr)) {
      return {
        type: "singleton",
        value: decodedStr,
      };
    }

    const values: string[] = [];
    let currentIndex = 0;
    while (currentIndex < key.length) {
      const lengthHex = key.slice(currentIndex, currentIndex + 4);
      const length = parseInt(lengthHex, 16) * 2;

      // We've assumed that the length of the key is less than 256
      // This should be the last part of key
      if (length > 256 || lengthHex === "0000") {
        const valueHex = key.slice(currentIndex);
        const decodedValue = hexToString(valueHex);
        values.push(nameRegex.test(decodedValue) ? decodedValue : valueHex);

        // length of hex string
        currentIndex += valueHex.length;
        break;
      }

      currentIndex += 4;

      if (currentIndex + length > key.length) {
        throw new Error("Invalid hex string for Bucket decoding");
      }

      const hexSegment = key.slice(currentIndex, currentIndex + length);
      const decodedSegement = hexToString(hexSegment);
      currentIndex += length;

      values.push(
        nameRegex.test(decodedSegement) ? decodedSegement : hexSegment
      );
    }

    return {
      type: "bucket",
      values,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  return {
    type: "singleton",
    value: key,
  };
};

export const parseValue = (value: string) => {
  try {
    return JSON.parse(Buffer.from(value, "base64").toString());
  } catch (error) {
    return value;
  }
};

export const groupByFirstIndex = (states: ContractState[]) =>
  states.reduce((acc, state) => {
    if (state.key.type === "bucket") {
      const firstIndexValue = state.key.values[0];
      acc[firstIndexValue] = acc[firstIndexValue]?.concat(state) ?? [state];
    } else {
      acc.others = acc.others?.concat(state) ?? [state];
    }
    return acc;
  }, {} as { [key: string]: ContractState[] });
