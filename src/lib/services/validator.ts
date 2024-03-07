import type { Coin } from "@cosmjs/stargate";
import axios from "axios";
import { z } from "zod";

import { CURR_THEME } from "env";
import type { Option, StakingShare, Validator, ValidatorAddr } from "lib/types";
import { BlockVote, zBig, zUtcDate, zValidatorData } from "lib/types";
import { parseWithError, removeSpecialChars, snakeToCamel } from "lib/utils";

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

const zHistoricalPowersItem = z.object({
  hour_rounded_timestamp: zUtcDate,
  timestamp: zUtcDate,
  voting_power: z.number().nonnegative(),
});

export const zHistoricalPowers = z
  .object({
    items: z.array(zHistoricalPowersItem),
    total: z.number(),
  })
  .transform((data) => snakeToCamel(data));
export type HistoricalPowers = z.infer<typeof zHistoricalPowers>;

export const getHistoricalPowers = async (
  endpoint: string,
  validatorAddr: ValidatorAddr
): Promise<HistoricalPowers> =>
  axios
    .get(`${endpoint}/${validatorAddr}/historical-powers`)
    .then(({ data }) => parseWithError(zHistoricalPowers, data));

const zValidatorsResponse = z
  .object({
    items: z.array(zValidatorData),
    total: z.number().nonnegative(),
    total_voting_power: zBig,
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
      signed_block: z.number(),
      proposed_block: z.number(),
      missed_blocks: z.number(),
      total: z.number(),
    }),
    recent_blocks: z
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
