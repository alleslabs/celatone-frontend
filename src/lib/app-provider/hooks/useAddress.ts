import { fromBech32 } from "@cosmjs/encoding";
import type { ChainRecord } from "@cosmos-kit/core";
import { useWallet } from "@cosmos-kit/react";
import { useCallback } from "react";

import type { Option } from "lib/types";

export type AddressReturnType =
  | "user_address"
  | "contract_address"
  | "validator_address"
  | "invalid_address";

const addressLengthMap: {
  [key: string]: { [length: number]: AddressReturnType };
} = {
  osmosis: {
    43: "user_address",
    50: "validator_address",
    63: "contract_address",
  },
  osmosistestnet5: {
    43: "user_address",
    50: "validator_address",
    63: "contract_address",
  },
  terra2: {
    44: "user_address",
    51: "validator_address",
    64: "contract_address",
  },
  terra2testnet: {
    44: "user_address",
    51: "validator_address",
    64: "contract_address",
  },
  sei: {
    42: "user_address",
    49: "validator_address",
    62: "contract_address",
  },
  seitestnet2: {
    42: "user_address",
    49: "validator_address",
    62: "contract_address",
  },
};

export const getAddressTypeByLength = (
  chainName: string,
  address: Option<string>
): AddressReturnType =>
  address
    ? addressLengthMap[chainName]?.[address.length] ?? "invalid_address"
    : "invalid_address";

const getPrefix = (basePrefix: string, addressType: AddressReturnType) => {
  if (addressType === "validator_address") return `${basePrefix}valoper`;
  return basePrefix;
};

const validateAddress = (
  currentChainRecord: ChainRecord | undefined,
  address: string,
  addressType: AddressReturnType
) => {
  if (!currentChainRecord) return "Invalid network";

  const prefix = getPrefix(currentChainRecord.chain.bech32_prefix, addressType);

  if (!address.startsWith(prefix))
    return `Invalid prefix (expected "${prefix}")`;

  if (getAddressTypeByLength(currentChainRecord.name, address) !== addressType)
    return "Invalid address length";

  try {
    fromBech32(address);
  } catch (e) {
    return (e as Error).message;
  }
  return null;
};

export const useGetAddressType = () => {
  const { currentChainName, currentChainRecord } = useWallet();
  return useCallback(
    (address: Option<string>): AddressReturnType => {
      const addressType = getAddressTypeByLength(currentChainName, address);
      if (
        !address ||
        addressType === "invalid_address" ||
        validateAddress(currentChainRecord, address, addressType)
      )
        return "invalid_address";
      return addressType;
    },
    [currentChainName, currentChainRecord]
  );
};

// TODO: refactor
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
    validateValidatorAddress: useCallback(
      (address: string) =>
        validateAddress(currentChainRecord, address, "validator_address"),
      [currentChainRecord]
    ),
  };
};
