import type {
  ProposalDataResponseRest,
  ProposalsResponseRest,
} from "lib/services/types";
import type {
  Coin,
  Nullable,
  Option,
  ProposalDeposit,
  ProposalStatus,
  ProposalVotesInfo,
} from "lib/types";

import axios from "axios";
import {
  zProposalDataResponseRest,
  zProposalDepositsResponseRest,
  zProposalParamsResponseRest,
  zProposalsResponseRest,
  zProposalVotesInfoResponseRest,
} from "lib/services/types";
import { parseWithError } from "lib/utils";

export const getProposalParamsRest = (restEndpoint: string) =>
  axios
    .get(`${restEndpoint}/cosmos/gov/v1/params/deposit`)
    .then(
      ({ data }) => parseWithError(zProposalParamsResponseRest, data).params
    );

export const getProposalsRest = async (
  endpoint: string,
  paginationKey: Option<string>,
  status?: Omit<ProposalStatus, "DEPOSIT_FAILED" | "CANCELLED">
): Promise<ProposalsResponseRest> =>
  axios
    .get(`${endpoint}/cosmos/gov/v1/proposals`, {
      params: {
        "pagination.key": paginationKey,
        "pagination.limit": 10,
        "pagination.reverse": true,
        ...(status && {
          proposal_status: `PROPOSAL_STATUS_${status.replace(/([a-z])([A-Z]+)/g, "$1_$2").toUpperCase()}`,
        }),
      },
    })
    .then(({ data }) => parseWithError(zProposalsResponseRest, data));

export const getProposalDataRest = async (
  endpoint: string,
  id: number
): Promise<ProposalDataResponseRest> =>
  axios
    .get(`${endpoint}/cosmos/gov/v1/proposals/${encodeURIComponent(id)}`)
    .then(({ data }) =>
      parseWithError(zProposalDataResponseRest, data.proposal)
    );

export const getProposalDepositsRest = async (endpoint: string, id: number) => {
  const result: ProposalDeposit<Coin>[] = [];

  const fetchFn = async (paginationKey: Nullable<string>) => {
    const res = await axios
      .get(
        `${endpoint}/cosmos/gov/v1/proposals/${encodeURIComponent(id)}/deposits`,
        {
          params: {
            "pagination.key": paginationKey,
            "pagination.limit": "1000",
          },
        }
      )
      .then(({ data }) => parseWithError(zProposalDepositsResponseRest, data));
    result.push(...res.deposits);
    if (res.pagination.nextKey) await fetchFn(res.pagination.nextKey);
  };

  await fetchFn(null);

  return result;
};

export const getProposalVotesInfoRest = async (
  endpoint: string,
  id: number
): Promise<ProposalVotesInfo> =>
  Promise.all([
    axios.get(
      `${endpoint}/cosmos/gov/v1/proposals/${encodeURIComponent(id)}/tally`
    ),
    axios.get(`${endpoint}/cosmos/staking/v1beta1/pool`),
  ]).then(([tallyRes, poolRes]) =>
    parseWithError(zProposalVotesInfoResponseRest, [
      tallyRes.data,
      poolRes.data,
    ])
  );
