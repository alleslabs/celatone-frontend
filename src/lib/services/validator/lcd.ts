import axios from "axios";

import {
  getAnnualProvisionsLcd,
  getDistributionParamsLcd,
  getEpochProvisionsLcd,
  getMintParamsLcd,
} from "../staking/lcd";
import type { ValidatorDelegatorsResponse } from "lib/services/types";
import {
  zValidatorDelegatorsResponse,
  zValidatorResponseLcd,
  zValidatorsResponseLcd,
} from "lib/services/types";
import { big } from "lib/types";
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
    .get(
      `${endpoint}/cosmos/staking/v1beta1/validators/${encodeURI(validatorAddr)}`
    )
    .then(({ data }) => parseWithError(zValidatorResponseLcd, data).validator);

export const getValidatorStakingProvisionsLcd = async (
  endpoint: string,
  chain: string
) => {
  if (chain === "osmosis") {
    const [mintParams, epochProvisions] = await Promise.all([
      getMintParamsLcd(endpoint, chain),
      getEpochProvisionsLcd(endpoint, chain),
    ]);

    const stakingProportion =
      mintParams.params.distributionProportions?.staking;

    if (!stakingProportion) throw new Error("Staking proportion not found");

    const epochStakingProvisions =
      epochProvisions.epochProvisions.mul(stakingProportion);

    const epochIndentifier = mintParams.params.epochIdentifier;

    if (epochIndentifier === "hour")
      return { stakingProvisions: epochStakingProvisions.mul(8760) };

    if (epochIndentifier === "day")
      return { stakingProvisions: epochStakingProvisions.mul(365) };

    if (epochIndentifier === "week")
      return { stakingProvisions: epochStakingProvisions.mul(52) };

    return { stakingProvisions: big(0) };
  }

  const [distParams, annualProvisions] = await Promise.all([
    getDistributionParamsLcd(endpoint),
    getAnnualProvisionsLcd(endpoint, chain),
  ]);

  const stakingProvisions = annualProvisions.annualProvisions.mul(
    big(1).sub(distParams.params.communityTax)
  );

  return { stakingProvisions };
};

export const getValidatorDelegatorsLcd = async (
  endpoint: string,
  validatorAddress: ValidatorAddr,
  isInitia: boolean
): Promise<ValidatorDelegatorsResponse> => {
  const route = isInitia
    ? "initia/mstaking/v1/validators"
    : "cosmos/staking/v1beta1/validators";

  return axios
    .get(
      `${endpoint}/${route}/${encodeURI(validatorAddress)}/delegations?pagination.limit=1&pagination.count_total=true`
    )
    .then(({ data }) =>
      parseWithError(zValidatorDelegatorsResponse, {
        total: Number(data.pagination.total),
      })
    );
};
