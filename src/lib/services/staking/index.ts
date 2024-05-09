import { useQuery } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useGovConfig,
  useLcdEndpoint,
} from "lib/app-provider";
import type { BechAddr } from "lib/types";

import { getDelegationsByAddress } from "./api";
import {
  getDelegationsByAddressLcd,
  getRedelegationsByAddressLcd,
  getStakingParamsLcd,
  getUnbondingsByAddressLcd,
} from "./lcd";

export const useStakingParamsLcd = () => {
  const endpoint = useLcdEndpoint();
  const { enabled } = useGovConfig({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.STAKING_PARAMS_LCD, endpoint],
    () => getStakingParamsLcd(endpoint),
    {
      enabled,
      refetchOnWindowFocus: false,
    }
  );
};

export const useDelegationsByAddressLcd = (address: BechAddr) => {
  const endpoint = useLcdEndpoint();
  const { enabled } = useGovConfig({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.DELEGATIONS_BY_ADDRESS_LCD, endpoint],
    () => getDelegationsByAddressLcd(endpoint, address),
    {
      enabled,
      refetchOnWindowFocus: false,
    }
  );
};

export const useUnbondingsByAddressLcd = (address: BechAddr) => {
  const endpoint = useLcdEndpoint();
  const { enabled } = useGovConfig({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.UNBONDINGS_BY_ADDRESS_LCD, endpoint],
    () => getUnbondingsByAddressLcd(endpoint, address),
    {
      enabled,
      refetchOnWindowFocus: false,
    }
  );
};

export const useRedelegationsByAddressLcd = (address: BechAddr) => {
  const endpoint = useLcdEndpoint();
  const { enabled } = useGovConfig({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.REDELEGATIONS_BY_ADDRESS_LCD, endpoint],
    () => getRedelegationsByAddressLcd(endpoint, address),
    {
      enabled,
      refetchOnWindowFocus: false,
    }
  );
};

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
