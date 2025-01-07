import { useCallback } from "react";

import { useConvertHexAddress } from "lib/app-provider";
import type { BechAddr, HexAddr } from "lib/types";
import {
  bech32AddressToHex,
  isHexModuleAddress,
  isHexWalletAddress,
  unpadHexAddress,
} from "lib/utils";

export const useFormatAddresses = () => {
  const { convertHexModuleAddress, convertHexWalletAddress } =
    useConvertHexAddress();

  return useCallback(
    (address: string) => {
      if (isHexWalletAddress(address))
        return {
          address: convertHexWalletAddress(address as HexAddr),
          hex: unpadHexAddress(address as HexAddr),
        };
      if (isHexModuleAddress(address))
        return {
          address: convertHexModuleAddress(address as HexAddr),
          hex: unpadHexAddress(address as HexAddr),
        };
      return {
        address: address as BechAddr,
        hex: unpadHexAddress(bech32AddressToHex(address as BechAddr)),
      };
    },
    [convertHexModuleAddress, convertHexWalletAddress]
  );
};
