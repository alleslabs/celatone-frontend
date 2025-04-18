import type { Nullable } from "lib/types";

import {
  useCurrentChain,
  useExampleAddresses,
  useValidateAddress,
} from "lib/app-provider";
import {
  isHexModuleAddress,
  isHexWalletAddress,
  splitModulePath,
  truncate,
} from "lib/utils";
import { useCallback } from "react";

export const useValidateModuleInput = () => {
  const { validateContractAddress, validateUserAddress } = useValidateAddress();
  const { bech32Prefix } = useCurrentChain();

  const { user } = useExampleAddresses();
  const truncateExampleAddr = truncate(user);
  const errText = `Input must be address (${truncateExampleAddr} or “0x123...456“) 
  or module path (“${truncateExampleAddr}::module_name” or “0x123...456::module_name“)
  or function path (“${truncateExampleAddr}::module_name::function_name” or “0x123...456::module_name::function_name“)`;

  return useCallback(
    (input: string): Nullable<string> => {
      const inputArr = splitModulePath(input);
      // Allow only module path for now
      if (inputArr.length > 3) return errText;
      const [address, module, functionName] = inputArr;
      const invalidAddress = address.startsWith(bech32Prefix)
        ? !!validateUserAddress(address) && !!validateContractAddress(address)
        : !isHexWalletAddress(address) && !isHexModuleAddress(address);

      if (invalidAddress || module === "" || functionName === "")
        return errText;

      return null;
    },
    [errText, bech32Prefix, validateContractAddress, validateUserAddress]
  );
};
