import axios from "axios";

import type { Option } from "lib/types";
import { ProposalStatusLcd } from "lib/types";
import { parseWithError } from "lib/utils";

import type { ProposalsResponseItemLcd, ProposalsResponseLcd } from "./types";
import { zProposalsResponseItemLcd, zProposalsResponseLcd } from "./types";

export const getProposalsLcd = async (
  endpoint: string,
  paginationKey: Option<string>,
  status?: Omit<ProposalStatusLcd, "DEPOSIT_FAILED" | "CANCELLED">
): Promise<ProposalsResponseLcd> =>
  axios
    .get(`${endpoint}/cosmos/gov/v1/proposals`, {
      params: {
        "pagination.limit": 10,
        "pagination.reverse": true,
        "pagination.key": paginationKey,
        ...(status &&
          status !== ProposalStatusLcd.ALL && { proposal_status: status }),
      },
    })
    .then(({ data }) => parseWithError(zProposalsResponseLcd, data));

export const getProposalDataLcd = async (
  endpoint: string,
  id: string
): Promise<ProposalsResponseItemLcd> =>
  axios
    .get(`${endpoint}/cosmos/gov/v1/proposals/${id}`)
    .then(({ data }) =>
      parseWithError(zProposalsResponseItemLcd, data.proposal)
    );
