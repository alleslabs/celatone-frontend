import axios from "axios";

import {
  zDelegationsResponse,
  zRedelegationsResponse,
  zStakingParamsResponse,
  zUnbondingsResponse,
} from "lib/services/types";
import { big } from "lib/types";
import type { Addr } from "lib/types";

export const getStakingParams = (endpoint: string) =>
  axios
    .get(`${endpoint}/cosmos/staking/v1beta1/params`)
    .then(({ data }) => zStakingParamsResponse.parse(data));

export const getDelegations = (endpoint: string, address: Addr) =>
  axios
    .get(`${endpoint}/cosmos/staking/v1beta1/delegations/${encodeURI(address)}`)
    .then(({ data }) =>
      zDelegationsResponse
        .parse(data)
        .delegationResponses.sort((a, b) =>
          big(b.balance.amount).cmp(a.balance.amount)
        )
    );

export const getUnbondings = (endpoint: string, address: Addr) =>
  axios
    .get(
      `${endpoint}/cosmos/staking/v1beta1/delegators/${encodeURI(address)}/unbonding_delegations`
    )
    .then(({ data }) =>
      zUnbondingsResponse
        .parse(data)
        .unbondingResponses.flatMap((unbonding) =>
          unbonding.entries.map((entry) => ({
            delegatorAddress: unbonding.delegatorAddress,
            validatorAddress: unbonding.validatorAddress,
            ...entry,
          }))
        )
        .sort((a, b) => a.completionTime.getTime() - b.completionTime.getTime())
    );

export const getRedelegations = (endpoint: string, address: Addr) =>
  axios
    .get(
      `${endpoint}/cosmos/staking/v1beta1/delegators/${encodeURI(address)}/redelegations`
    )
    .then(({ data }) =>
      zRedelegationsResponse
        .parse(data)
        .redelegationResponses.flatMap((redelegation) =>
          redelegation.entries.map((entry) => ({
            ...redelegation.redelegation,
            ...entry.redelegationEntry,
            balance: entry.balance,
          }))
        )
        .sort((a, b) => a.completionTime.getTime() - b.completionTime.getTime())
    );
