import type { BechAddr, Option, ValidatorAddr } from "lib/types";

import { useQuery } from "@tanstack/react-query";
import {
  CELATONE_QUERY_KEYS,
  useCelatoneApp,
  useGovConfig,
} from "lib/app-provider";
import { isUndefined } from "lodash";

import {
  getCommissionsByValidatorAddressRest,
  getDelegationRewardsByAddressRest,
} from "./rest";

export const useDelegationRewardsByAddressRest = (
  address: BechAddr,
  enabled: boolean
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const gov = useGovConfig({ shouldRedirect: false });

  return useQuery(
    [
      CELATONE_QUERY_KEYS.DELEGATION_REWARDS_BY_ADDRESS_REST,
      restEndpoint,
      address,
    ],
    () => getDelegationRewardsByAddressRest(restEndpoint, address),
    {
      enabled: enabled && gov.enabled,
      refetchOnWindowFocus: false,
    }
  );
};

export const useCommissionsByValidatorAddressRest = (
  valAddr: Option<ValidatorAddr>,
  enabled: boolean
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const gov = useGovConfig({ shouldRedirect: false });

  return useQuery(
    [
      CELATONE_QUERY_KEYS.COMMISSIONS_BY_VALIDATOR_ADDRESS_REST,
      restEndpoint,
      valAddr,
    ],
    () => {
      if (isUndefined(valAddr)) return { commission: [] };
      return getCommissionsByValidatorAddressRest(restEndpoint, valAddr);
    },
    {
      enabled: enabled && gov.enabled,
      refetchOnWindowFocus: false,
    }
  );
};
