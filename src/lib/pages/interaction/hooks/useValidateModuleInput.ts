import { useCallback } from "react";

import {
  useCurrentChain,
  useExampleAddresses,
  useValidateAddress,
} from "lib/app-provider";
import { isHexAddress, splitModule, truncate } from "lib/utils";

export const useValidateModuleInput = () => {
  const { validateUserAddress } = useValidateAddress();
  const {
    chain: { bech32_prefix: prefix },
  } = useCurrentChain();

  const { user } = useExampleAddresses();
  const truncateExampleAddr = truncate(user);
  const errText = `Input must be address (${truncateExampleAddr} or “0x123...456) 
  or module path (“${truncateExampleAddr}::module_name” or “0x123...456::module_name)
  or function path (“${truncateExampleAddr}::module_name::function_name” or “0x123...456::module_name::function_name)`;

  return useCallback(
    (input: string): string | null => {
      const inputArr = splitModule(input);
      // Allow only module path for now
      if (inputArr.length > 3) return errText;
      const [address, module, functionName] = inputArr;
      const addrErr = validateUserAddress(address);
      const invalidAddress = address.startsWith(prefix)
        ? addrErr
        : !isHexAddress(address);

      if (invalidAddress || module === "" || functionName === "")
        return errText;

      return null;
    },
    [errText, prefix, validateUserAddress]
  );
};
