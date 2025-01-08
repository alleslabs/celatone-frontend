import { useQuery } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useGovConfig,
} from "lib/app-provider";
import type { BechAddr } from "lib/types";

import { getDelegationData } from "./api";
import {
  getDelegationsByAddressLcd,
  getRedelegationsByAddressLcd,
  getStakingParamsLcd,
  getUnbondingsByAddressLcd,
} from "./lcd";

export const useStakingParamsLcd = (enabled: boolean) => {
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();
  const gov = useGovConfig({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.STAKING_PARAMS_LCD, lcdEndpoint],
    () => getStakingParamsLcd(lcdEndpoint),
    {
      enabled: enabled && gov.enabled,
      refetchOnWindowFocus: false,
    }
  );
};

export const useDelegationsByAddressLcd = (
  address: BechAddr,
  enabled = true
) => {
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();
  const gov = useGovConfig({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.DELEGATIONS_BY_ADDRESS_LCD, lcdEndpoint, address],
    () => getDelegationsByAddressLcd(lcdEndpoint, address),
    {
      enabled: enabled && gov.enabled,
      refetchOnWindowFocus: false,
    }
  );
};

export const useUnbondingsByAddressLcd = (
  address: BechAddr,
  enabled: boolean
) => {
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();
  const gov = useGovConfig({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.UNBONDINGS_BY_ADDRESS_LCD, lcdEndpoint, address],
    () => getUnbondingsByAddressLcd(lcdEndpoint, address),
    {
      enabled: enabled && gov.enabled,
      refetchOnWindowFocus: false,
    }
  );
};

export const useRedelegationsByAddressLcd = (
  address: BechAddr,
  enabled: boolean
) => {
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();
  const gov = useGovConfig({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.REDELEGATIONS_BY_ADDRESS_LCD, lcdEndpoint, address],
    () => getRedelegationsByAddressLcd(lcdEndpoint, address),
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
