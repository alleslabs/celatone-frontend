import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
} from "lib/app-provider";
import type { Addr, ValidatorAddr } from "lib/types";

import type {
  RawCommission,
  RawDelegation,
  RawDelegationRewards,
  RawRedelegation,
  RawStakingParams,
  RawUnbonding,
} from "./delegation";
import {
  getCommission,
  getDelegations,
  getDelegationRewards,
  getRedelegations,
  getStakingParams,
  getUnbondings,
  getAccountDelegations,
} from "./delegation";

export const useStakingParams = (): UseQueryResult<RawStakingParams> => {
  const lcdEndpoint = useBaseApiRoute("staking");

  const queryFn = useCallback(
    async () => getStakingParams(lcdEndpoint),
    [lcdEndpoint]
  );

  return useQuery([CELATONE_QUERY_KEYS.STAKING_PARAMS, lcdEndpoint], queryFn, {
    refetchOnWindowFocus: false,
  });
};

export const useDelegations = (
  address: Addr
): UseQueryResult<RawDelegation[]> => {
  const lcdEndpoint = useBaseApiRoute("staking");

  const queryFn = useCallback(
    async () => getDelegations(lcdEndpoint, address),
    [address, lcdEndpoint]
  );

  return useQuery(
    [CELATONE_QUERY_KEYS.DELEGATIONS_BY_ADDRESS, lcdEndpoint, address],
    queryFn,
    {
      refetchOnWindowFocus: false,
    }
  );
};

export const useUnbondings = (
  address: Addr
): UseQueryResult<RawUnbonding[]> => {
  const lcdEndpoint = useBaseApiRoute("staking");

  const queryFn = useCallback(
    async () => getUnbondings(lcdEndpoint, address),
    [address, lcdEndpoint]
  );

  return useQuery(
    [CELATONE_QUERY_KEYS.UNBONDINGS_BY_ADDRESS, lcdEndpoint, address],
    queryFn,
    {
      refetchOnWindowFocus: false,
    }
  );
};

export const useDelegationRewards = (
  address: Addr
): UseQueryResult<RawDelegationRewards> => {
  const lcdEndpoint = useBaseApiRoute("rest");

  const queryFn = useCallback(
    async () => getDelegationRewards(lcdEndpoint, address),
    [address, lcdEndpoint]
  );

  return useQuery(
    [CELATONE_QUERY_KEYS.DELEGATION_REWARDS_BY_ADDRESS, lcdEndpoint, address],
    queryFn,
    {
      refetchOnWindowFocus: false,
    }
  );
};

export const useRedelegations = (
  address: Addr
): UseQueryResult<RawRedelegation[]> => {
  const lcdEndpoint = useBaseApiRoute("staking");

  const queryFn = useCallback(
    async () => getRedelegations(lcdEndpoint, address),
    [address, lcdEndpoint]
  );

  return useQuery(
    [CELATONE_QUERY_KEYS.REDELEGATIONS_BY_ADDRESS, lcdEndpoint, address],
    queryFn,
    {
      refetchOnWindowFocus: false,
    }
  );
};

export const useCommission = (
  address: ValidatorAddr
): UseQueryResult<RawCommission> => {
  const lcdEndpoint = useBaseApiRoute("rest");

  const queryFn = useCallback(
    async () => getCommission(lcdEndpoint, address),
    [address, lcdEndpoint]
  );

  return useQuery(
    [CELATONE_QUERY_KEYS.COMMISSION_BY_VAL_ADDRESS, lcdEndpoint, address],
    queryFn,
    {
      refetchOnWindowFocus: false,
    }
  );
};

export const useAccountDelegations = (address: Addr) => {
  const endpoint = useBaseApiRoute("accounts");
  const {
    chainConfig: {
      extra: { disableDelegation },
    },
  } = useCelatoneApp();

  return useQuery(
    [CELATONE_QUERY_KEYS.ACCOUNT_DELEGATIONS, endpoint, address],
    () => getAccountDelegations(endpoint, address),
    {
      enabled: !disableDelegation,
      refetchOnWindowFocus: false,
    }
  );
};
