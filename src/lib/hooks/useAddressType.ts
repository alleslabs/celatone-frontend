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

export const useGetAddressType = () => {
  const { currentChainName } = useWallet();
  return useCallback(
    (address: string): AddressReturnType => {
      const chainAddressMap = addressLengthMap[currentChainName];
      if (address.length in chainAddressMap) {
        return chainAddressMap[address.length];
      }
      return "invalid_address";
    },
    [currentChainName]
  );
};
