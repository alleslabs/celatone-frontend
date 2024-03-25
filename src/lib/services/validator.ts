import type { Coin } from "@cosmjs/stargate";
import axios from "axios";
import { z } from "zod";

import { CURR_THEME } from "env";
import type { Option, StakingShare, Validator, ValidatorAddr } from "lib/types";
import {
  BlockVote,
  zBechAddr,
  zBig,
  zCoin,
  zUtcDate,
  zValidatorData,
} from "lib/types";
import {
  parseTxHash,
  parseWithError,
  removeSpecialChars,
  snakeToCamel,
} from "lib/utils";

import { zBlocksResponse } from "./block";
import { zProposal } from "./proposal";

interface ValidatorResponse {
  operator_address: ValidatorAddr;
  consensus_pubkey: {
    "@type": string;
    key: string;
  };
  jailed: boolean;
  status: string;
  tokens: Coin[];
  delegator_shares: StakingShare[];
  description: {
    moniker: string;
    identity: string;
    website: string;
    security_contact: string;
    details: string;
  };
  unbonding_height: string;
  unbonding_time: string;
  commission: {
    commission_rates: {
      rate: string;
      max_rate: string;
      max_change_rate: string;
    };
    update_time: string;
  };
  min_self_delegation: string;
}

export const getValidator = async (
  endpoint: string,
  validatorAddr: ValidatorAddr
): Promise<Validator> => {
  const { data } = await axios.get<{ validator: ValidatorResponse }>(
    `${endpoint}/validators/${validatorAddr}`
  );
  return {
    validatorAddress: data.validator.operator_address,
    moniker: data.validator.description.moniker,
    identity: data.validator.description.identity,
  };
};

export const resolveValIdentity = async (
  chainName: string,
  validator: Validator
): Promise<string> => {
  const githubUrl = `https://raw.githubusercontent.com/cosmostation/chainlist/master/chain/${chainName}/moniker/${validator.validatorAddress}.png`;
  const keybaseUrl = `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${validator.identity}&fields=pictures`;
  const uiAvatarsUrl = `https://ui-avatars.com/api/?name=${removeSpecialChars(
    validator.moniker ?? ""
  )}&background=${CURR_THEME.colors.secondary.main.replace("#", "")}&color=fff`;

  return (
    axios
      .get(githubUrl)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .then((_) => githubUrl)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch(async (_) => {
        if (validator.identity) {
          const { data } = await axios.get(keybaseUrl);
          if (data.them.length) return data.them[0].pictures.primary.url;
        }
        return uiAvatarsUrl;
      })
  );
};

const zHistoricalPowersItem = z
  .object({
    hour_rounded_timestamp: zUtcDate,
    timestamp: zUtcDate,
    voting_power: zBig,
  })
  .transform(snakeToCamel);
export type HistoricalPowersItem = z.infer<typeof zHistoricalPowersItem>;

export const zHistoricalPowersResponse = z
  .object({
    items: z.array(zHistoricalPowersItem),
    total: z.number(),
  })
  .transform(snakeToCamel);
export type HistoricalPowersResponse = z.infer<
  typeof zHistoricalPowersResponse
>;

export const getHistoricalPowers = async (
  endpoint: string,
  validatorAddr: ValidatorAddr
): Promise<HistoricalPowersResponse> =>
  axios
    .get(`${endpoint}/${validatorAddr}/historical-powers`)
    .then(({ data }) => parseWithError(zHistoricalPowersResponse, data));

const zValidatorsResponse = z
  .object({
    items: z.array(zValidatorData),
    total: z.number().nonnegative(),
    metadata: z.object({
      total_voting_power: zBig,
      active_count: z.number().nonnegative(),
      inactive_count: z.number().nonnegative(),
      percent_33_rank: z.number().positive(),
      percent_66_rank: z.number().positive(),
      min_commission_rate: z.coerce.number(),
    }),
  })
  .transform(snakeToCamel);
export type ValidatorsResponse = z.infer<typeof zValidatorsResponse>;

export const getValidators = async (
  endpoint: string,
  limit: number,
  offset: number,
  isActive: boolean,
  sortBy: string,
  isDesc: boolean,
  search: Option<string>
) =>
  axios
    .get(`${endpoint}`, {
      params: {
        limit,
        offset,
        is_active: isActive,
        sort_by: sortBy,
        is_desc: isDesc,
        search,
      },
    })
    .then(({ data }) => parseWithError(zValidatorsResponse, data));

const zStakingProvisionsResponse = z
  .object({
    staking_provisions: zBig,
  })
  .transform(snakeToCamel);
export type StakingProvisionsResponse = z.infer<
  typeof zStakingProvisionsResponse
>;

export const getValidatorStakingProvisions = async (endpoint: string) =>
  axios
    .get(`${endpoint}/staking-provisions`)
    .then(({ data }) => parseWithError(zStakingProvisionsResponse, data));

const zValidatorDataResponse = z
  .object({
    info: zValidatorData.nullable(),
    self_voting_power: zBig,
    total_voting_power: zBig,
  })
  .transform(snakeToCamel);
export type ValidatorDataResponse = z.infer<typeof zValidatorDataResponse>;

export const getValidatorData = async (
  endpoint: string,
  validatorAddress: ValidatorAddr
) =>
  axios
    .get(`${endpoint}/${encodeURIComponent(validatorAddress)}/info`)
    .then(({ data }) => parseWithError(zValidatorDataResponse, data));

const zValidatorUptimeResponse = z
  .object({
    uptime: z.object({
      signed_blocks: z.number(),
      proposed_blocks: z.number(),
      missed_blocks: z.number(),
      total: z.number(),
    }),
    recent_100_blocks: z
      .object({
        height: z.number(),
        vote: z.nativeEnum(BlockVote),
      })
      .array(),
    events: z
      .object({
        height: z.number(),
        timestamp: zUtcDate,
        is_jailed: z.boolean(),
      })
      .array(),
  })
  .transform(snakeToCamel);
export type ValidatorUptimeResponse = z.infer<typeof zValidatorUptimeResponse>;

export const getValidatorUptime = async (
  endpoint: string,
  validatorAddress: ValidatorAddr,
  blocks: number
) =>
  axios
    .get(`${endpoint}/${encodeURIComponent(validatorAddress)}/uptime`, {
      params: {
        blocks,
      },
    })
    .then(({ data }) => parseWithError(zValidatorUptimeResponse, data));

const zValidatorDelegationRelatedTxsResponseItem = z
  .object({
    tx_hash: z.string().transform(parseTxHash),
    height: z.number().positive(),
    tokens: zCoin.array(),
    timestamp: zUtcDate,
    messages: z.array(
      z.object({
        type: z.string(),
      })
    ),
    sender: zBechAddr,
  })
  .transform(snakeToCamel);
export type ValidatorDelegationRelatedTxsResponseItem = z.infer<
  typeof zValidatorDelegationRelatedTxsResponseItem
>;

const zValidatorDelegationRelatedTxsResponse = z.object({
  items: z.array(zValidatorDelegationRelatedTxsResponseItem),
  total: z.number().nonnegative(),
});

export type ValidatorDelegationRelatedTxsResponse = z.infer<
  typeof zValidatorDelegationRelatedTxsResponse
>;

export const getValidatorDelegationRelatedTxs = async (
  endpoint: string,
  validatorAddress: ValidatorAddr,
  limit: number,
  offset: number
) =>
  axios
    .get(
      `${endpoint}/${encodeURIComponent(validatorAddress)}/delegation-related-txs`,
      {
        params: {
          limit,
          offset,
        },
      }
    )
    .then(({ data }) =>
      parseWithError(zValidatorDelegationRelatedTxsResponse, data)
    );

export const getValidatorProposedBlocks = async (
  endpoint: string,
  validatorAddress: ValidatorAddr,
  limit: number,
  offset: number
) =>
  axios
    .get(
      `${endpoint}/${encodeURIComponent(validatorAddress)}/proposed-blocks`,
      {
        params: {
          limit,
          offset,
        },
      }
    )
    .then(({ data }) => parseWithError(zBlocksResponse, data));

const zValidatorDelegatorsResponse = z.object({
  total: z.number().nonnegative(),
});

export type ValidatorDelegatorsResponse = z.infer<
  typeof zValidatorDelegatorsResponse
>;

export const getValidatorDelegators = async (
  endpoint: string,
  validatorAddress: ValidatorAddr
) =>
  axios
    .get(`${endpoint}/${encodeURIComponent(validatorAddress)}/delegators`)
    .then(({ data }) => parseWithError(zValidatorDelegatorsResponse, data));

const zValidatorVotedProposalsResponseItem = zProposal
  .extend({
    yes: zBig,
    abstain: zBig,
    no: zBig,
    no_with_veto: zBig,
    is_vote_weighted: z.boolean(),
  })
  .transform(snakeToCamel);

const zValidatorVotedProposalsResponse = z.object({
  items: z.array(zValidatorVotedProposalsResponseItem),
  total: z.number().nonnegative(),
});
export type ValidatorVotedProposalsResponse = z.infer<
  typeof zValidatorVotedProposalsResponse
>;

export const getValidatorVotedProposals = async (
  endpoint: string,
  validatorAddress: ValidatorAddr,
  limit: number,
  offset: number,
  answer?: string,
  search?: string
) =>
  axios
    .get(
      `${endpoint}/${encodeURIComponent(validatorAddress)}/voted-proposals`,
      {
        params: {
          limit,
          offset,
          answer,
          search,
        },
      }
    )
    .then(({ data }) => parseWithError(zValidatorVotedProposalsResponse, data));
