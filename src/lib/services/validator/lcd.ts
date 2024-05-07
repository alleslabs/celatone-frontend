import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { CELATONE_QUERY_KEYS, useLcdEndpoint } from "lib/app-provider";
import {
  zValidatorResponseLcd,
  zValidatorsResponseLcd,
} from "lib/services/types";
import type { Nullable, ValidatorAddr, ValidatorData } from "lib/types";
import { parseWithError } from "lib/utils";

const getValidatorsLcd = async (endpoint: string) => {
  const result: ValidatorData[] = [];

  const fetchFn = async (paginationKey: Nullable<string>) => {
    const res = await axios
      .get(`${endpoint}/cosmos/staking/v1beta1/validators`, {
        params: { "pagination.key": paginationKey, "pagination.limit": "1000" },
      })
      .then(({ data }) => parseWithError(zValidatorsResponseLcd, data));
    result.push(...res.validators);
    if (res.pagination.nextKey) await fetchFn(res.pagination.nextKey);
  };

  await fetchFn(null);

  return result;
};

export const useValidatorsLcd = () => {
  const endpoint = useLcdEndpoint();

  return useQuery<ValidatorData[]>(
    [CELATONE_QUERY_KEYS.VALIDATORS_LCD, endpoint],
    async () => getValidatorsLcd(endpoint),
    {
      retry: 1,
      keepPreviousData: true,
    }
  );
};

const getValidatorLcd = (endpoint: string, validatorAddr: ValidatorAddr) =>
  axios
    .get(`${endpoint}/cosmos/staking/v1beta1/validators/${validatorAddr}`)
    .then(({ data }) => parseWithError(zValidatorResponseLcd, data).validator);

export const useValidator = (validatorAddr: ValidatorAddr, enabled = true) => {
  const endpoint = useLcdEndpoint();

  return useQuery<ValidatorData>(
    [
      CELATONE_QUERY_KEYS.VALIDATOR_DATA_LCD,
      endpoint,
      validatorAddr,
    ] as string[],
    async () => getValidatorLcd(endpoint, validatorAddr),
    {
      enabled: enabled && Boolean(validatorAddr),
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};
