import type { BechAddr } from "lib/types";

import axios from "axios";
import {
  zAnnualProvisionsResponseRest,
  zDelegationsResponseRest,
  zDistributionParamsResponseRest,
  zEpochProvisionsResponseRest,
  zMintParamsResponseRest,
  zRedelegationsResponseRest,
  zStakingParamsResponseRest,
  zUnbondingsResponseRest,
} from "lib/services/types";
import { big } from "lib/types";
import { parseWithError } from "lib/utils";

export const getStakingParamsRest = (endpoint: string) =>
  axios
    .get(`${endpoint}/cosmos/staking/v1beta1/params`)
    .then(
      ({ data }) => parseWithError(zStakingParamsResponseRest, data).params
    );

export const getDelegationsByAddressRest = (
  endpoint: string,
  address: BechAddr
) =>
  axios
    .get(`${endpoint}/cosmos/staking/v1beta1/delegations/${encodeURI(address)}`)
    .then(({ data }) =>
      parseWithError(zDelegationsResponseRest, data).delegationResponses.sort(
        (a, b) => big(b.balance.amount).cmp(a.balance.amount)
      )
    );

export const getUnbondingsByAddressRest = (
  endpoint: string,
  address: BechAddr
) =>
  axios
    .get(
      `${endpoint}/cosmos/staking/v1beta1/delegators/${encodeURI(address)}/unbonding_delegations`
    )
    .then(({ data }) =>
      parseWithError(zUnbondingsResponseRest, data)
        .unbondingResponses.flatMap((unbonding) =>
          unbonding.entries.map((entry) => ({
            delegatorAddress: unbonding.delegatorAddress,
            validatorAddress: unbonding.validatorAddress,
            ...entry,
          }))
        )
        .sort((a, b) => a.completionTime.getTime() - b.completionTime.getTime())
    );

export const getRedelegationsByAddressRest = (
  endpoint: string,
  address: BechAddr
) =>
  axios
    .get(
      `${endpoint}/cosmos/staking/v1beta1/delegators/${encodeURI(address)}/redelegations`
    )
    .then(({ data }) =>
      parseWithError(zRedelegationsResponseRest, data)
        .redelegationResponses.flatMap((redelegation) =>
          redelegation.entries.map((entry) => ({
            ...redelegation.redelegation,
            ...entry.redelegationEntry,
            balance: entry.balance,
          }))
        )
        .sort((a, b) => a.completionTime.getTime() - b.completionTime.getTime())
    );

export const getDistributionParamsRest = (endpoint: string) =>
  axios
    .get(`${endpoint}/cosmos/distribution/v1beta1/params`)
    .then(({ data }) => parseWithError(zDistributionParamsResponseRest, data));

export const getAnnualProvisionsRest = (endpoint: string, chain: string) => {
  if (chain === "sei")
    return {
      annualProvisions: big(0),
    };

  return axios
    .get(`${endpoint}/cosmos/mint/v1beta1/annual_provisions`)
    .then(({ data }) => parseWithError(zAnnualProvisionsResponseRest, data));
};

export const getMintParamsRest = (endpoint: string, chain: string) =>
  axios
    .get(
      `${endpoint}/${chain === "osmosis" ? chain : "cosmos"}/mint/v1beta1/params`
    )
    .then(({ data }) => parseWithError(zMintParamsResponseRest, data));

export const getEpochProvisionsRest = (endpoint: string, chain: string) => {
  if (chain !== "osmosis") {
    throw new Error("Unsupported chain");
  }

  return axios
    .get(`${endpoint}/osmosis/mint/v1beta1/epoch_provisions`)
    .then(({ data }) => parseWithError(zEpochProvisionsResponseRest, data));
};
