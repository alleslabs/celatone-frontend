import { useQuery } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useGovConfig,
} from "lib/app-provider";
import type { BechAddr } from "lib/types";

import type {} from "./delegation";
import { getDelegationsByAddress } from "./delegation";

export const useDelegationsByAddress = (address: BechAddr) => {
  const endpoint = useBaseApiRoute("accounts");
  const { enabled } = useGovConfig({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.DELEGATIONS_BY_ADDRESS, endpoint, address],
    () => getDelegationsByAddress(endpoint, address),
    {
      enabled,
      refetchOnWindowFocus: false,
    }
  );
};
