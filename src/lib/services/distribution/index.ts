import { useQuery } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useGovConfig,
  useLcdEndpoint,
} from "lib/app-provider";
import type { BechAddr, ValidatorAddr } from "lib/types";

import {
  getCommissionByValidatorAddressLcd,
  getDelegationRewardsByAddressLcd,
} from "./lcd";

export const useDelegationRewardsByAddressLcd = (address: BechAddr) => {
  const endpoint = useLcdEndpoint();
  const { enabled } = useGovConfig({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.DELEGATIONS_BY_ADDRESS_LCD, endpoint],
    () => getDelegationRewardsByAddressLcd(endpoint, address),
    {
      enabled,
      refetchOnWindowFocus: false,
    }
  );
};

export const useCommissionByValidatorAddressLcd = (valAddr: ValidatorAddr) => {
  const endpoint = useLcdEndpoint();
  const { enabled } = useGovConfig({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.COMMISSION_BY_VALIDATOR_ADDRESS_LCD, endpoint],
    () => getCommissionByValidatorAddressLcd(endpoint, valAddr),
    {
      enabled,
      refetchOnWindowFocus: false,
    }
  );
};
