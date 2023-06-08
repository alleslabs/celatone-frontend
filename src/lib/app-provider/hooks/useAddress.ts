import { fromBech32 } from "@cosmjs/encoding";
import type { ChainRecord } from "@cosmos-kit/core";
import { useWallet } from "@cosmos-kit/react";
import { useCallback, useMemo } from "react";

import { useCelatoneApp } from "../contexts";
import type { Option } from "lib/types";

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
  currentChainRecord: ChainRecord | undefined,
  address: string,
  addressType: AddressReturnType,
  getAddressTypeByLength: GetAddressTypeByLengthFn
) => {
  if (!currentChainRecord) return "Invalid network";

  const prefix = getPrefix(currentChainRecord.chain.bech32_prefix, addressType);

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
  const { currentChainRecord } = useWallet();
  const getAddressTypeByLength = useGetAddressTypeByLength();
  return useCallback(
    (address: Option<string>): AddressReturnType => {
      const addressType = getAddressTypeByLength(address);
      if (
        !address ||
        addressType === "invalid_address" ||
        validateAddress(
          currentChainRecord,
          address,
          addressType,
          getAddressTypeByLength
        )
      )
        return "invalid_address";
      return addressType;
    },
    [currentChainRecord, getAddressTypeByLength]
  );
};

// TODO: refactor
export const useValidateAddress = () => {
  const { currentChainRecord } = useWallet();
  const getAddressTypeByLength = useGetAddressTypeByLength();

  return {
    validateContractAddress: useCallback(
      (address: string) =>
        validateAddress(
          currentChainRecord,
          address,
          "contract_address",
          getAddressTypeByLength
        ),
      [currentChainRecord, getAddressTypeByLength]
    ),
    validateUserAddress: useCallback(
      (address: string) =>
        validateAddress(
          currentChainRecord,
          address,
          "user_address",
          getAddressTypeByLength
        ),
      [currentChainRecord, getAddressTypeByLength]
    ),
    validateValidatorAddress: useCallback(
      (address: string) =>
        validateAddress(
          currentChainRecord,
          address,
          "validator_address",
          getAddressTypeByLength
        ),
      [currentChainRecord, getAddressTypeByLength]
    ),
  };
};
