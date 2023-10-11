import type { QueryFunction, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS, useBaseApiRoute } from "lib/app-provider";
import type { MoveAccountAddr } from "lib/types";
import type { InternalResource } from "lib/types/move/resource";

import { getAccountResources } from "./resource";

export const useAccountResources = ({
  address,
}: {
  address: MoveAccountAddr;
}): UseQueryResult<InternalResource[]> => {
  const baseEndpoint = useBaseApiRoute("rest");
  const queryFn: QueryFunction<InternalResource[]> = () =>
    getAccountResources(baseEndpoint, address);
  return useQuery(
    [CELATONE_QUERY_KEYS.ACCOUNT_RESOURCES, baseEndpoint, address],
    queryFn,
    { enabled: Boolean(address), refetchOnWindowFocus: false, retry: 1 }
  );
};
