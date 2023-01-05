import { fromBech32 } from "@cosmjs/encoding";
import type { ChainRecord } from "@cosmos-kit/core";
import { useWallet } from "@cosmos-kit/react";
import { useCallback } from "react";

export type AddressReturnType =
  | "user_address"
  | "contract_address"
  | "invalid_address";

export type AddressValidationError =
  | null
  | "Invalid Network"
  | "Incorrect Prefix"
  | "Invalid Address Length";

const addressLengthMap: {
  [key: string]: { [length: number]: AddressReturnType };
} = {
  osmosis: {
    43: "user_address",
    63: "contract_address",
  },
  osmosistestnet: {
    43: "user_address",
    63: "contract_address",
  },
};

const getAddressTypeByLength = (
  chainName: string,
  address: string
): AddressReturnType => {
  return addressLengthMap[chainName]?.[address.length] ?? "invalid_address";
};

export const useGetAddressType = () => {
  const { currentChainName } = useWallet();
  return useCallback(
    (address: string): AddressReturnType =>
      getAddressTypeByLength(currentChainName, address),
    [currentChainName]
  );
};

const validateAddress = (
  currentChainRecord: ChainRecord | undefined,
  address: string,
  addressType: AddressReturnType
) => {
  if (!currentChainRecord) return "Invalid Network";
  if (getAddressTypeByLength(currentChainRecord.name, address) !== addressType)
    return "Invalid Address Length";

  try {
    if (fromBech32(address).prefix !== currentChainRecord.chain.bech32_prefix)
      return "Incorrect Prefix";
  } catch (e) {
    return e;
  }
  return null;
};

export const useValidateContractAddress = () => {
  const { currentChainRecord } = useWallet();

  return useCallback(
    (address: string) =>
      validateAddress(currentChainRecord, address, "contract_address"),
    [currentChainRecord]
  );
};

export const useValidateUserAddress = () => {
  const { currentChainRecord } = useWallet();

  return useCallback(
    (address: string) =>
      validateAddress(currentChainRecord, address, "user_address"),
    [currentChainRecord]
  );
};
