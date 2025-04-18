import type {
  ValidatorDelegatorsResponse,
  ValidatorInfoRest,
} from "lib/services/types";
import type { Nullable, ValidatorAddr } from "lib/types";

import axios from "axios";
import {
  zValidatorDelegatorsResponse,
  zValidatorResponseRest,
  zValidatorsResponseRest,
} from "lib/services/types";
import { big } from "lib/types";
import { parseWithError } from "lib/utils";

import {
  getAnnualProvisionsRest,
  getDistributionParamsRest,
  getEpochProvisionsRest,
  getMintParamsRest,
} from "../staking/rest";

export const getValidatorsRest = async (endpoint: string) => {
  const result: ValidatorInfoRest[] = [];

  const fetchFn = async (paginationKey: Nullable<string>) => {
    const res = await axios
      .get(`${endpoint}/cosmos/staking/v1beta1/validators`, {
        params: { "pagination.key": paginationKey, "pagination.limit": "1000" },
      })
      .then(({ data }) => parseWithError(zValidatorsResponseRest, data));
    result.push(...res.validators);
    if (res.pagination.nextKey) await fetchFn(res.pagination.nextKey);
  };

  await fetchFn(null);

  return result;
};

export const getValidatorDataRest = (
  endpoint: string,
  validatorAddr: ValidatorAddr
) =>
  axios
    .get(
      `${endpoint}/cosmos/staking/v1beta1/validators/${encodeURI(validatorAddr)}`
    )
    .then(({ data }) => parseWithError(zValidatorResponseRest, data).validator);

export const getValidatorStakingProvisionsRest = async (
  endpoint: string,
  chain: string
) => {
  if (chain === "osmosis") {
    const [mintParams, epochProvisions] = await Promise.all([
      getMintParamsRest(endpoint, chain),
      getEpochProvisionsRest(endpoint, chain),
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

    throw new Error("Unsupported epoch identifier");
  }

  const [distParams, annualProvisions] = await Promise.all([
    getDistributionParamsRest(endpoint),
    getAnnualProvisionsRest(endpoint, chain),
  ]);

  const stakingProvisions = annualProvisions.annualProvisions.mul(
    big(1).sub(distParams.params.communityTax)
  );

  return { stakingProvisions };
};

export const getValidatorDelegatorsRest = async (
  endpoint: string,
  validatorAddress: ValidatorAddr,
  isInitia: boolean
): Promise<ValidatorDelegatorsResponse> => {
  const route = isInitia
    ? "initia/mstaking/v1/validators"
    : "cosmos/staking/v1beta1/validators";

  return axios
    .get(`${endpoint}/${route}/${encodeURI(validatorAddress)}/delegations`, {
      params: {
        "pagination.count_total": "true",
        "pagination.limit": "1",
      },
    })
    .then(({ data }) =>
      parseWithError(zValidatorDelegatorsResponse, {
        total: Number(data.pagination.total),
      })
    );
};
