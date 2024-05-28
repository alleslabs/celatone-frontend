import axios from "axios";

import {
  zDepositParamsLcd,
  zProposalsResponseItemLcd,
  zProposalsResponseLcd,
  zVotingParamsLcd,
} from "lib/services/types";
import type {
  ProposalsResponseItemLcd,
  ProposalsResponseLcd,
} from "lib/services/types";
import type { Option, ProposalStatus } from "lib/types";
import { parseWithError } from "lib/utils";

export const getDepositParamsLcd = (lcdEndpoint: string) =>
  axios
    .get(`${lcdEndpoint}/cosmos/gov/v1beta1/params/deposit`)
    .then(({ data }) => parseWithError(zDepositParamsLcd, data));

export const getVotingParamsLcd = (lcdEndpoint: string) =>
  axios
    .get(`${lcdEndpoint}/cosmos/gov/v1beta1/params/voting`)
    .then(({ data }) => parseWithError(zVotingParamsLcd, data));

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
  id: string
): Promise<ProposalsResponseItemLcd> =>
  axios
    .get(`${endpoint}/cosmos/gov/v1/proposals/${encodeURI(id)}`)
    .then(({ data }) =>
      parseWithError(zProposalsResponseItemLcd, data.proposal)
    );
