import { useWallet } from "@cosmos-kit/react";
import { useMemo } from "react";

export const useAddressType = (address: string) => {
  const { currentChainName } = useWallet();
  return useMemo(() => {
    if (
      currentChainName === "osmosis" ||
      currentChainName === "osmosistestnet"
    ) {
      switch (address.length) {
        case 43:
          return "user_address";
        case 63:
          return "contract_address";
        default:
          break;
      }
    }
    return undefined;
  }, [address.length, currentChainName]);
};
