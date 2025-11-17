import type { HexAddr } from "lib/types";

import { useCelatoneApp, useConvertHexAddress } from "lib/app-provider";
import { zBechAddr, zHexAddr } from "lib/types";
import {
  bech32AddressToHex,
  isBech32Address,
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
  const { convertHexModuleAddress, convertHexWalletAddress } =
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
      // Handle empty or invalid input
      if (!address || address.trim() === "") {
        return {
          address: zBechAddr.parse(""),
          hex: zHexAddr.parse("0x0"),
        };
      }

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

      // Validate bech32 address before conversion
      if (!isBech32Address(address)) {
        // Return fallback values for invalid bech32 addresses
        // This handles cases where the address is too short or malformed
        return {
          address: zBechAddr.parse(""),
          hex: zHexAddr.parse("0x0"),
        };
      }

      const bechAddr = zBechAddr.parse(address);
      return {
        address: bechAddr,
        hex: formatHexAddress(bech32AddressToHex(bechAddr)),
      };
    },
    [convertHexModuleAddress, convertHexWalletAddress, formatHexAddress]
  );
};
