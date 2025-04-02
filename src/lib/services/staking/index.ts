import type { BechAddr } from "lib/types";

import { useQuery } from "@tanstack/react-query";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useGovConfig,
} from "lib/app-provider";

import { getDelegationData } from "./api";
import {
  getDelegationsByAddressRest,
  getRedelegationsByAddressRest,
  getStakingParamsRest,
  getUnbondingsByAddressRest,
} from "./rest";

export const useStakingParamsRest = (enabled: boolean) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const gov = useGovConfig({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.STAKING_PARAMS_REST, restEndpoint],
    () => getStakingParamsRest(restEndpoint),
    {
      enabled: enabled && gov.enabled,
      refetchOnWindowFocus: false,
    }
  );
};

export const useDelegationsByAddressRest = (
  address: BechAddr,
  enabled = true
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const gov = useGovConfig({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.DELEGATIONS_BY_ADDRESS_REST, restEndpoint, address],
    () => getDelegationsByAddressRest(restEndpoint, address),
    {
      enabled: enabled && gov.enabled,
      refetchOnWindowFocus: false,
    }
  );
};

export const useUnbondingsByAddressRest = (
  address: BechAddr,
  enabled: boolean
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const gov = useGovConfig({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.UNBONDINGS_BY_ADDRESS_REST, restEndpoint, address],
    () => getUnbondingsByAddressRest(restEndpoint, address),
    {
      enabled: enabled && gov.enabled,
      refetchOnWindowFocus: false,
    }
  );
};

export const useRedelegationsByAddressRest = (
  address: BechAddr,
  enabled: boolean
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const gov = useGovConfig({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.REDELEGATIONS_BY_ADDRESS_REST, restEndpoint, address],
    () => getRedelegationsByAddressRest(restEndpoint, address),
    {
      enabled: enabled && gov.enabled,
      refetchOnWindowFocus: false,
    }
  );
};

export const useDelegationData = (address: BechAddr, enabled: boolean) => {
  const endpoint = useBaseApiRoute("accounts");
  const gov = useGovConfig({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.DELEGATIONS_BY_ADDRESS, endpoint, address],
    () => getDelegationData(endpoint, address),
    {
      enabled: enabled && gov.enabled,
      refetchOnWindowFocus: false,
    }
  );
};
