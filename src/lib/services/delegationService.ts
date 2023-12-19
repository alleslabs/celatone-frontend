import { useQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS, useBaseApiRoute } from "lib/app-provider";
import type { Addr } from "lib/types";

import type {} from "./delegation";
import { getDelegationsByAddress } from "./delegation";

export const useDelegationsByAddress = (address: Addr) => {
  const endpoint = useBaseApiRoute("accounts");

  return useQuery(
    [CELATONE_QUERY_KEYS.DELEGATIONS_BY_ADDRESS, endpoint, address],
    () => getDelegationsByAddress(endpoint, address),
    {
      refetchOnWindowFocus: false,
    }
  );
};
