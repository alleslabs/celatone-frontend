import axios from "axios";

import {
  zBlocksResponse,
  zHistoricalPowersResponse,
  zStakingProvisionsResponse,
  zValidatorDataResponse,
  zValidatorDelegationRelatedTxsResponse,
  zValidatorsResponse,
  zValidatorUptimeResponse,
  zValidatorVotedProposalsResponse,
  zValidatorVotedProposalsResponseAnswerCounts,
} from "lib/services/types";
import type { Option, ValidatorAddr } from "lib/types";
import { parseWithError } from "lib/utils";

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

export const getValidatorData = async (
  endpoint: string,
  validatorAddress: ValidatorAddr
) =>
  axios
    .get(`${endpoint}/${encodeURIComponent(validatorAddress)}/info`)
    .then(({ data }) => parseWithError(zValidatorDataResponse, data));

export const getValidatorStakingProvisions = async (endpoint: string) =>
  axios
    .get(`${endpoint}/staking-provisions`)
    .then(({ data }) => parseWithError(zStakingProvisionsResponse, data));

export const getValidatorVotedProposalsAnswerCounts = async (
  endpoint: string,
  validatorAddress: ValidatorAddr
) =>
  axios
    .get(`${endpoint}/${encodeURIComponent(validatorAddress)}/answer-counts`)
    .then(({ data }) =>
      parseWithError(zValidatorVotedProposalsResponseAnswerCounts, data)
    );

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

export const getHistoricalPowers = async (
  endpoint: string,
  validatorAddr: ValidatorAddr
) =>
  axios
    .get(`${endpoint}/${validatorAddr}/historical-powers`)
    .then(({ data }) => parseWithError(zHistoricalPowersResponse, data));

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
