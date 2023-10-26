import { useCallback } from "react";

import { useConvertHexAddress, useValidateAddress } from "lib/app-provider";
import type { HexAddr, HumanAddr } from "lib/types";
import { bech32AddressToHex, unpadHexAddress } from "lib/utils";

export const useFormatAddresses = () => {
  const { convertHexWalletAddress, convertHexModuleAddress } =
    useConvertHexAddress();
  const { validateHexWalletAddress, validateHexModuleAddress } =
    useValidateAddress();

  return useCallback(
    (address: string) => {
      if (validateHexWalletAddress(address))
        return {
          address: convertHexWalletAddress(address as HexAddr),
          hex: unpadHexAddress(address as HexAddr),
        };
      if (validateHexModuleAddress(address))
        return {
          address: convertHexModuleAddress(address as HexAddr),
          hex: unpadHexAddress(address as HexAddr),
        };
      return {
        address: address as HumanAddr,
        hex: unpadHexAddress(bech32AddressToHex(address as HumanAddr)),
      };
    },
    [
      convertHexModuleAddress,
      convertHexWalletAddress,
      validateHexModuleAddress,
      validateHexWalletAddress,
    ]
  );
};
