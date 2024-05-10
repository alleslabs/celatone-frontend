import { useQuery } from "@tanstack/react-query";
import { isUndefined } from "lodash";

import {
  CELATONE_QUERY_KEYS,
  useGovConfig,
  useLcdEndpoint,
} from "lib/app-provider";
import type { BechAddr, Option, ValidatorAddr } from "lib/types";

import {
  getCommissionsByValidatorAddressLcd,
  getDelegationRewardsByAddressLcd,
} from "./lcd";

export const useDelegationRewardsByAddressLcd = (
  address: BechAddr,
  enabled: boolean
) => {
  const endpoint = useLcdEndpoint();
  const gov = useGovConfig({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.DELEGATION_REWARDS_BY_ADDRESS_LCD, endpoint],
    () => getDelegationRewardsByAddressLcd(endpoint, address),
    {
      enabled: enabled && gov.enabled,
      refetchOnWindowFocus: false,
    }
  );
};

export const useCommissionsByValidatorAddressLcd = (
  valAddr: Option<ValidatorAddr>,
  enabled: boolean
) => {
  const endpoint = useLcdEndpoint();
  const gov = useGovConfig({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.COMMISSION_BY_VALIDATOR_ADDRESS_LCD, endpoint],
    () => {
      if (isUndefined(valAddr))
        throw new Error("Validator address is undefined");
      return getCommissionsByValidatorAddressLcd(endpoint, valAddr);
    },
    {
      enabled: enabled && gov.enabled && !isUndefined(valAddr),
      refetchOnWindowFocus: false,
    }
  );
};
