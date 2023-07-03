import { useMemo } from "react";

import { useCurrentChain } from "lib/app-provider/hooks/useCurrentChain";
import { DEFAULT_ADDRESS } from "lib/data";
import { formatUserKey } from "lib/utils";

/**
 * TODO: Remove later, should not be necessary after building app context
 * @returns  userkey string
 */

export const useUserKey = () => {
  const {
    chain: { chain_name: chainName },
  } = useCurrentChain();
  return useMemo(() => {
    return formatUserKey(chainName, DEFAULT_ADDRESS);
  }, [chainName]);
};
