import axios from "axios";

import {
  zValidatorResponseLcd,
  zValidatorsResponseLcd,
} from "lib/services/types";
import type { Nullable, ValidatorAddr, ValidatorData } from "lib/types";
import { parseWithError } from "lib/utils";

export const getValidatorsLcd = async (endpoint: string) => {
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

export const getValidatorDataLcd = (
  endpoint: string,
  validatorAddr: ValidatorAddr
) =>
  axios
    .get(`${endpoint}/cosmos/staking/v1beta1/validators/${validatorAddr}`)
    .then(({ data }) => parseWithError(zValidatorResponseLcd, data).validator);
