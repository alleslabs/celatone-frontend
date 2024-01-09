import { useCallback } from "react";

import { useConvertHexAddress } from "lib/app-provider";
import type { BechAddr, HexAddr } from "lib/types";
import {
  bech32AddressToHex,
  isHex32Address,
  isHex20Address,
  unpadHexAddress,
} from "lib/utils";

export const useFormatAddresses = () => {
  const { convertHexWalletAddress, convertHexModuleAddress } =
    useConvertHexAddress();

  return useCallback(
    (address: string) => {
      if (isHex20Address(address))
        return {
          address: convertHexWalletAddress(address as HexAddr),
          hex: unpadHexAddress(address as HexAddr),
        };
      if (isHex32Address(address))
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
