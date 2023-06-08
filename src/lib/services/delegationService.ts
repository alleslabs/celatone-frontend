import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useLCDEndpoint } from "lib/app-provider";
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
} from "./delegation";

export const useStakingParams = (): UseQueryResult<RawStakingParams> => {
  const lcdEndpoint = useLCDEndpoint();

  const queryFn = useCallback(
    async () => getStakingParams(lcdEndpoint),
    [lcdEndpoint]
  );

  return useQuery(["query", "staking_params", lcdEndpoint], queryFn, {
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useDelegations = (
  address: Addr
): UseQueryResult<RawDelegation[]> => {
  const lcdEndpoint = useLCDEndpoint();

  const queryFn = useCallback(
    async () => getDelegations(lcdEndpoint, address),
    [address, lcdEndpoint]
  );

  return useQuery(["query", "delegations", lcdEndpoint, address], queryFn, {
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useUnbondings = (
  address: Addr
): UseQueryResult<RawUnbonding[]> => {
  const lcdEndpoint = useLCDEndpoint();

  const queryFn = useCallback(
    async () => getUnbondings(lcdEndpoint, address),
    [address, lcdEndpoint]
  );

  return useQuery(["query", "unbondings", lcdEndpoint, address], queryFn, {
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useDelegationRewards = (
  address: Addr
): UseQueryResult<RawDelegationRewards> => {
  const lcdEndpoint = useLCDEndpoint();

  const queryFn = useCallback(
    async () => getDelegationRewards(lcdEndpoint, address),
    [address, lcdEndpoint]
  );

  return useQuery(
    ["query", "delegation_rewards", lcdEndpoint, address],
    queryFn,
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useRedelegations = (
  address: Addr
): UseQueryResult<RawRedelegation[]> => {
  const lcdEndpoint = useLCDEndpoint();

  const queryFn = useCallback(
    async () => getRedelegations(lcdEndpoint, address),
    [address, lcdEndpoint]
  );

  return useQuery(["query", "redelegations", lcdEndpoint, address], queryFn, {
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCommission = (
  address: ValidatorAddr
): UseQueryResult<RawCommission> => {
  const lcdEndpoint = useLCDEndpoint();

  const queryFn = useCallback(
    async () => getCommission(lcdEndpoint, address),
    [address, lcdEndpoint]
  );

  return useQuery(["query", "commission", lcdEndpoint, address], queryFn, {
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
