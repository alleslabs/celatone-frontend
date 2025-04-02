import type { HexAddr } from "lib/types";

import { useCelatoneApp, useConvertHexAddress } from "lib/app-provider";
import { zBechAddr, zHexAddr } from "lib/types";
import {
  bech32AddressToHex,
  isHexModuleAddress,
  isHexWalletAddress,
  toChecksumAddress,
  unpadHexAddress,
} from "lib/utils";
import { useCallback } from "react";

export const useFormatAddresses = () => {
  const {
    chainConfig: {
      features: { move },
    },
  } = useCelatoneApp();
  const { convertHexWalletAddress, convertHexModuleAddress } =
    useConvertHexAddress();

  const formatHexAddress = useCallback(
    (address: HexAddr) => {
      if (move.enabled) return unpadHexAddress(address);
      return toChecksumAddress(address);
    },
    [move.enabled]
  );

  return useCallback(
    (address: string) => {
      if (isHexWalletAddress(address))
        return {
          address: convertHexWalletAddress(zHexAddr.parse(address)),
          hex: formatHexAddress(zHexAddr.parse(address)),
        };
      if (isHexModuleAddress(address))
        return {
          address: convertHexModuleAddress(zHexAddr.parse(address)),
          hex: formatHexAddress(zHexAddr.parse(address)),
        };
      return {
        address: zBechAddr.parse(address),
        hex: formatHexAddress(bech32AddressToHex(zBechAddr.parse(address))),
      };
    },
    [convertHexModuleAddress, convertHexWalletAddress, formatHexAddress]
  );
};
