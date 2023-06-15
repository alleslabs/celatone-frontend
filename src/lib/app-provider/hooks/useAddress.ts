import { fromBech32 } from "@cosmjs/encoding";
import { useCallback, useMemo } from "react";

import { useCelatoneApp } from "../contexts";
import type { Option } from "lib/types";

import { useCurrentChain } from "./useCurrentChain";

export type AddressReturnType =
  | "user_address"
  | "contract_address"
  | "validator_address"
  | "invalid_address";

export const useGetAddressTypeByLength = () => {
  const {
    chainConfig: { exampleAddresses },
  } = useCelatoneApp();
  const addressLengthMap = useMemo(
    () =>
      Object.entries(exampleAddresses).reduce<{
        [key: number]: AddressReturnType;
      }>(
        (acc, curr) => ({
          ...acc,
          [curr[1].length]: `${curr[0]}_address` as AddressReturnType,
        }),
        {}
      ),
    [exampleAddresses]
  );
  return useCallback(
    (address: Option<string>): AddressReturnType =>
      address
        ? addressLengthMap[address.length] ?? "invalid_address"
        : "invalid_address",
    [addressLengthMap]
  );
};

export type GetAddressTypeByLengthFn = ReturnType<
  typeof useGetAddressTypeByLength
>;

const getPrefix = (basePrefix: string, addressType: AddressReturnType) => {
  if (addressType === "validator_address") return `${basePrefix}valoper`;
  return basePrefix;
};

const validateAddress = (
  bech32Prefix: string,
  address: string,
  addressType: AddressReturnType,
  getAddressTypeByLength: GetAddressTypeByLengthFn
) => {
  if (!bech32Prefix)
    return "Can not retrieve bech32 prefix of the current network.";

  const prefix = getPrefix(bech32Prefix, addressType);

  if (!address.startsWith(prefix))
    return `Invalid prefix (expected "${prefix}")`;

  if (getAddressTypeByLength(address) !== addressType)
    return "Invalid address length";

  try {
    fromBech32(address);
  } catch (e) {
    return (e as Error).message;
  }
  return null;
};

export const useGetAddressType = () => {
  const {
    chain: { bech32_prefix: bech32Prefix },
  } = useCurrentChain();
  const getAddressTypeByLength = useGetAddressTypeByLength();
  return useCallback(
    (address: Option<string>): AddressReturnType => {
      const addressType = getAddressTypeByLength(address);
      if (
        !address ||
        addressType === "invalid_address" ||
        validateAddress(
          bech32Prefix,
          address,
          addressType,
          getAddressTypeByLength
        )
      )
        return "invalid_address";
      return addressType;
    },
    [bech32Prefix, getAddressTypeByLength]
  );
};

// TODO: refactor
export const useValidateAddress = () => {
  const {
    chain: { bech32_prefix: bech32Prefix },
  } = useCurrentChain();
  const getAddressTypeByLength = useGetAddressTypeByLength();

  return {
    validateContractAddress: useCallback(
      (address: string) =>
        validateAddress(
          bech32Prefix,
          address,
          "contract_address",
          getAddressTypeByLength
        ),
      [bech32Prefix, getAddressTypeByLength]
    ),
    validateUserAddress: useCallback(
      (address: string) =>
        validateAddress(
          bech32Prefix,
          address,
          "user_address",
          getAddressTypeByLength
        ),
      [bech32Prefix, getAddressTypeByLength]
    ),
    validateValidatorAddress: useCallback(
      (address: string) =>
        validateAddress(
          bech32Prefix,
          address,
          "validator_address",
          getAddressTypeByLength
        ),
      [bech32Prefix, getAddressTypeByLength]
    ),
  };
};
