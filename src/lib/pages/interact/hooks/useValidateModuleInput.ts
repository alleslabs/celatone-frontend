import { useCallback } from "react";

import {
  useCurrentChain,
  useExampleAddresses,
  useValidateAddress,
} from "lib/app-provider";
import type { Nullable } from "lib/types";
import {
  isHexModuleAddress,
  isHexWalletAddress,
  splitModulePath,
  truncate,
} from "lib/utils";

export const useValidateModuleInput = () => {
  const { validateUserAddress, validateContractAddress } = useValidateAddress();
  const {
    chain: { bech32_prefix: prefix },
  } = useCurrentChain();

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
      const invalidAddress = address.startsWith(prefix)
        ? !!validateUserAddress(address) && !!validateContractAddress(address)
        : !isHexWalletAddress(address) && !isHexModuleAddress(address);

      if (invalidAddress || module === "" || functionName === "")
        return errText;

      return null;
    },
    [errText, prefix, validateContractAddress, validateUserAddress]
  );
};
