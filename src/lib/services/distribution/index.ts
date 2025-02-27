import { useQuery } from "@tanstack/react-query";
import { isUndefined } from "lodash";

import {
  CELATONE_QUERY_KEYS,
  useCelatoneApp,
  useGovConfig,
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
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();
  const gov = useGovConfig({ shouldRedirect: false });

  return useQuery(
    [
      CELATONE_QUERY_KEYS.DELEGATION_REWARDS_BY_ADDRESS_LCD,
      lcdEndpoint,
      address,
    ],
    () => getDelegationRewardsByAddressLcd(lcdEndpoint, address),
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
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();
  const gov = useGovConfig({ shouldRedirect: false });

  return useQuery(
    [
      CELATONE_QUERY_KEYS.COMMISSIONS_BY_VALIDATOR_ADDRESS_LCD,
      lcdEndpoint,
      valAddr,
    ],
    () => {
      if (isUndefined(valAddr)) return { commission: [] };
      return getCommissionsByValidatorAddressLcd(lcdEndpoint, valAddr);
    },
    {
      enabled: enabled && gov.enabled,
      refetchOnWindowFocus: false,
    }
  );
};
