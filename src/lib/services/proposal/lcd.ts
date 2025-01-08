import axios from "axios";

import type {
  ProposalDataResponseLcd,
  ProposalsResponseLcd,
} from "lib/services/types";
import {
  zProposalDataResponseLcd,
  zProposalDepositsResponseLcd,
  zProposalParamsResponseLcd,
  zProposalsResponseLcd,
  zProposalVotesInfoResponseLcd,
} from "lib/services/types";
import type {
  Coin,
  Nullable,
  Option,
  ProposalDeposit,
  ProposalStatus,
  ProposalVotesInfo,
} from "lib/types";
import { parseWithError } from "lib/utils";

export const getProposalParamsLcd = (lcdEndpoint: string) =>
  axios
    .get(`${lcdEndpoint}/cosmos/gov/v1/params/deposit`)
    .then(
      ({ data }) => parseWithError(zProposalParamsResponseLcd, data).params
    );

export const getProposalsLcd = async (
  endpoint: string,
  paginationKey: Option<string>,
  status?: Omit<ProposalStatus, "DEPOSIT_FAILED" | "CANCELLED">
): Promise<ProposalsResponseLcd> =>
  axios
    .get(`${endpoint}/cosmos/gov/v1/proposals`, {
      params: {
        "pagination.limit": 10,
        "pagination.reverse": true,
        "pagination.key": paginationKey,
        ...(status && {
          proposal_status: `PROPOSAL_STATUS_${status.replace(/([a-z])([A-Z]+)/g, "$1_$2").toUpperCase()}`,
        }),
      },
    })
    .then(({ data }) => parseWithError(zProposalsResponseLcd, data));

export const getProposalDataLcd = async (
  endpoint: string,
  id: number
): Promise<ProposalDataResponseLcd> =>
  axios
    .get(`${endpoint}/cosmos/gov/v1/proposals/${encodeURIComponent(id)}`)
    .then(({ data }) =>
      parseWithError(zProposalDataResponseLcd, data.proposal)
    );

export const getProposalDepositsLcd = async (endpoint: string, id: number) => {
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
      .then(({ data }) => parseWithError(zProposalDepositsResponseLcd, data));
    result.push(...res.deposits);
    if (res.pagination.nextKey) await fetchFn(res.pagination.nextKey);
  };

  await fetchFn(null);

  return result;
};

export const getProposalVotesInfoLcd = async (
  endpoint: string,
  id: number
): Promise<ProposalVotesInfo> =>
  Promise.all([
    axios.get(
      `${endpoint}/cosmos/gov/v1/proposals/${encodeURIComponent(id)}/tally`
    ),
    axios.get(`${endpoint}/cosmos/staking/v1beta1/pool`),
  ]).then(([tallyRes, poolRes]) =>
    parseWithError(zProposalVotesInfoResponseLcd, [tallyRes.data, poolRes.data])
  );
