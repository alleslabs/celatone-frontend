import axios from "axios";

import {
  zDelegationsResponseLcd,
  zRedelegationsResponseLcd,
  zStakingParamsResponseLcd,
  zUnbondingsResponseLcd,
} from "lib/services/types";
import { big } from "lib/types";
import type { BechAddr } from "lib/types";

export const getStakingParamsLcd = (endpoint: string) =>
  axios
    .get(`${endpoint}/cosmos/staking/v1beta1/params`)
    .then(({ data }) => zStakingParamsResponseLcd.parse(data));

export const getDelegationsByAddressLcd = (
  endpoint: string,
  address: BechAddr
) =>
  axios
    .get(`${endpoint}/cosmos/staking/v1beta1/delegations/${encodeURI(address)}`)
    .then(({ data }) =>
      zDelegationsResponseLcd
        .parse(data)
        .delegationResponses.sort((a, b) =>
          big(b.balance.amount).cmp(a.balance.amount)
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
      zUnbondingsResponseLcd
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

export const getRedelegationsByAddressLcd = (
  endpoint: string,
  address: BechAddr
) =>
  axios
    .get(
      `${endpoint}/cosmos/staking/v1beta1/delegators/${encodeURI(address)}/redelegations`
    )
    .then(({ data }) =>
      zRedelegationsResponseLcd
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
