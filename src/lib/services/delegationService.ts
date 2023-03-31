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
  const endpoint = useLCDEndpoint();

  const queryFn = useCallback(
    async () => getStakingParams(endpoint),
    [endpoint]
  );

  return useQuery(["query", "staking_params", endpoint], queryFn);
};

export const useDelegations = (
  address: Addr
): UseQueryResult<RawDelegation[]> => {
  const endpoint = useLCDEndpoint();

  const queryFn = useCallback(
    async () => getDelegations(endpoint, address),
    [address, endpoint]
  );

  return useQuery(["query", "delegations", endpoint, address], queryFn);
};

export const useUnbondings = (
  address: Addr
): UseQueryResult<RawUnbonding[]> => {
  const endpoint = useLCDEndpoint();

  const queryFn = useCallback(
    async () => getUnbondings(endpoint, address),
    [address, endpoint]
  );

  return useQuery(["query", "unbondings", endpoint, address], queryFn);
};

export const useDelegationRewards = (
  address: Addr
): UseQueryResult<RawDelegationRewards> => {
  const endpoint = useLCDEndpoint();

  const queryFn = useCallback(
    async () => getDelegationRewards(endpoint, address),
    [address, endpoint]
  );

  return useQuery(["query", "delegation_rewards", endpoint, address], queryFn);
};

export const useRedelegations = (
  address: Addr
): UseQueryResult<RawRedelegation[]> => {
  const endpoint = useLCDEndpoint();

  const queryFn = useCallback(
    async () => getRedelegations(endpoint, address),
    [address, endpoint]
  );

  return useQuery(["query", "redelegations", endpoint, address], queryFn);
};

export const useCommission = (
  address: ValidatorAddr
): UseQueryResult<RawCommission> => {
  const endpoint = useLCDEndpoint();

  const queryFn = useCallback(
    async () => getCommission(endpoint, address),
    [address, endpoint]
  );

  return useQuery(["query", "commission", endpoint, address], queryFn);
};
