import { useWasmConfig } from "lib/app-provider";
import { type Addr32, zBechAddr32, zHexAddr32 } from "lib/types";
import { useCallback } from "react";

import { useFormatAddresses } from "./useFormatAddresses";

export const useNftAddressFormat = () => {
  const { enabled: isWasm } = useWasmConfig({ shouldRedirect: false });
  const formatAddresses = useFormatAddresses();

  return useCallback(
    (address: string): Addr32 => {
      const formatted = formatAddresses(address);
      return isWasm
        ? zBechAddr32.parse(formatted.address)
        : zHexAddr32.parse(formatted.hex);
    },
    [isWasm, formatAddresses]
  );
};
