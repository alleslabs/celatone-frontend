import { useQuery } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
} from "lib/app-provider";
import type { BechAddr } from "lib/types";

import type {} from "./delegation";
import { getDelegationsByAddress } from "./delegation";

export const useDelegationsByAddress = (address: BechAddr) => {
  const endpoint = useBaseApiRoute("accounts");
  const {
    chainConfig: {
      extra: { disableDelegation },
    },
  } = useCelatoneApp();

  return useQuery(
    [CELATONE_QUERY_KEYS.DELEGATIONS_BY_ADDRESS, endpoint, address],
    () => getDelegationsByAddress(endpoint, address),
    {
      enabled: !disableDelegation,
      refetchOnWindowFocus: false,
    }
  );
};
