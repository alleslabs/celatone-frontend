import { fromBech32 } from "@cosmjs/encoding";
import type { ChainRecord } from "@cosmos-kit/core";
import { useWallet } from "@cosmos-kit/react";
import { useCallback } from "react";

export type AddressReturnType =
  | "user_address"
  | "contract_address"
  | "invalid_address";

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
  if (!currentChainRecord) return "Invalid network";
  if (getAddressTypeByLength(currentChainRecord.name, address) !== addressType)
    return "Invalid address length";

  try {
    const { prefix } = fromBech32(address);
    if (prefix !== currentChainRecord.chain.bech32_prefix)
      return `Invalid prefix (${prefix})`;
  } catch (e) {
    return (e as Error).message;
  }
  return null;
};

export const useValidateAddress = () => {
  const { currentChainRecord } = useWallet();

  return {
    validateContractAddress: useCallback(
      (address: string) =>
        validateAddress(currentChainRecord, address, "contract_address"),
      [currentChainRecord]
    ),
    validateUserAddress: useCallback(
      (address: string) =>
        validateAddress(currentChainRecord, address, "user_address"),
      [currentChainRecord]
    ),
  };
};
