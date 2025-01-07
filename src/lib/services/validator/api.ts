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
        is_active: isActive,
        is_desc: isDesc,
        limit,
        offset,
        search,
        sort_by: sortBy,
      },
    })
    .then(({ data }) => parseWithError(zValidatorsResponse, data));

export const getValidatorData = async (
  endpoint: string,
  validatorAddress: ValidatorAddr
) =>
  axios
    .get(`${endpoint}/${encodeURI(validatorAddress)}/info`)
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
    .get(`${endpoint}/${encodeURI(validatorAddress)}/answer-counts`)
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
    .get(`${endpoint}/${encodeURI(validatorAddress)}/voted-proposals`, {
      params: {
        answer,
        limit,
        offset,
        search,
      },
    })
    .then(({ data }) => parseWithError(zValidatorVotedProposalsResponse, data));

export const getValidatorUptime = async (
  endpoint: string,
  validatorAddress: ValidatorAddr,
  blocks: number
) =>
  axios
    .get(`${endpoint}/${encodeURI(validatorAddress)}/uptime`, {
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
    .get(`${endpoint}/${encodeURI(validatorAddress)}/proposed-blocks`, {
      params: {
        limit,
        offset,
      },
    })
    .then(({ data }) => parseWithError(zBlocksResponse, data));

export const getHistoricalPowers = async (
  endpoint: string,
  validatorAddr: ValidatorAddr
) =>
  axios
    .get(`${endpoint}/${encodeURI(validatorAddr)}/historical-powers`)
    .then(({ data }) => parseWithError(zHistoricalPowersResponse, data));

export const getValidatorDelegationRelatedTxs = async (
  endpoint: string,
  validatorAddress: ValidatorAddr,
  limit: number,
  offset: number
) =>
  axios
    .get(`${endpoint}/${encodeURI(validatorAddress)}/delegation-related-txs`, {
      params: {
        limit,
        offset,
      },
    })
    .then(({ data }) =>
      parseWithError(zValidatorDelegationRelatedTxsResponse, data)
    );
