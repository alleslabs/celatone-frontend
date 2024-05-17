import axios from "axios";

import {
  zAnnualProvisionsResponseLcd,
  zDelegationsResponseLcd,
  zDistributionParamsResponseLcd,
  zEpochProvisionsResponseLcd,
  zMintParamsResponseLcd,
  zRedelegationsResponseLcd,
  zStakingParamsResponseLcd,
  zUnbondingsResponseLcd,
} from "lib/services/types";
import { big } from "lib/types";
import type { BechAddr } from "lib/types";
import { parseWithError } from "lib/utils";

export const getStakingParamsLcd = (endpoint: string) =>
  axios
    .get(`${endpoint}/cosmos/staking/v1beta1/params`)
    .then(({ data }) => parseWithError(zStakingParamsResponseLcd, data).params);

export const getDelegationsByAddressLcd = (
  endpoint: string,
  address: BechAddr
) =>
  axios
    .get(`${endpoint}/cosmos/staking/v1beta1/delegations/${encodeURI(address)}`)
    .then(({ data }) =>
      parseWithError(zDelegationsResponseLcd, data).delegationResponses.sort(
        (a, b) => big(b.balance.amount).cmp(a.balance.amount)
      )
    );

export const getUnbondingsByAddressLcd = (
  endpoint: string,
  address: BechAddr
) =>
  axios
    .get(
      `${endpoint}/cosmos/staking/v1beta1/delegators/${encodeURI(address)}/unbonding_delegations`
    )
    .then(({ data }) =>
      parseWithError(zUnbondingsResponseLcd, data)
        .unbondingResponses.flatMap((unbonding) =>
          unbonding.entries.map((entry) => ({
            delegatorAddress: unbonding.delegatorAddress,
            validatorAddress: unbonding.validatorAddress,
            ...entry,
          }))
        )
        .sort((a, b) => a.completionTime.getTime() - b.completionTime.getTime())
    );

export const getRedelegationsByAddressLcd = (
  endpoint: string,
  address: BechAddr
) =>
  axios
    .get(
      `${endpoint}/cosmos/staking/v1beta1/delegators/${encodeURI(address)}/redelegations`
    )
    .then(({ data }) =>
      parseWithError(zRedelegationsResponseLcd, data)
        .redelegationResponses.flatMap((redelegation) =>
          redelegation.entries.map((entry) => ({
            ...redelegation.redelegation,
            ...entry.redelegationEntry,
            balance: entry.balance,
          }))
        )
        .sort((a, b) => a.completionTime.getTime() - b.completionTime.getTime())
    );

export const getDistributionParamsLcd = (endpoint: string) =>
  axios
    .get(`${endpoint}/cosmos/distribution/v1beta1/params`)
    .then(({ data }) => parseWithError(zDistributionParamsResponseLcd, data));

export const getAnnualProvisionsLcd = (endpoint: string, chain: string) => {
  if (chain === "sei")
    return {
      annualProvisions: big(0),
    };

  return axios
    .get(`${endpoint}/cosmos/mint/v1beta1/annual_provisions`)
    .then(({ data }) => parseWithError(zAnnualProvisionsResponseLcd, data));
};

export const getMintParamsLcd = (endpoint: string, chain: string) =>
  axios
    .get(
      `${endpoint}/${chain === "osmosis" ? chain : "cosmos"}/mint/v1beta1/params`
    )
    .then(({ data }) => parseWithError(zMintParamsResponseLcd, data));

export const getEpochProvisionsLcd = (endpoint: string, chain: string) => {
  if (chain !== "osmosis") {
    throw new Error("Unsupported chain");
  }

  return axios
    .get(`${endpoint}/osmosis/mint/v1beta1/epoch_provisions`)
    .then(({ data }) => parseWithError(zEpochProvisionsResponseLcd, data));
};
