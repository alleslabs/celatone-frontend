import axios from "axios";

import {
  zDepositParamsLcd,
  zProposalsResponseItemLcd,
  zProposalsResponseLcd,
  zUploadAccesParamsLcd,
  zUploadAccessParamsSubspaceLcd,
  zVotingParamsLcd,
} from "lib/services/types";
import type {
  ProposalsResponseItemLcd,
  ProposalsResponseLcd,
  UploadAccessParams,
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

export const getUploadAccessParamsLcd = async (
  lcdEndpoint: string
): Promise<UploadAccessParams> => {
  const res = await axios.get(`${lcdEndpoint}/cosmwasm/wasm/v1/codes/params`);
  const validated = zUploadAccesParamsLcd.safeParse(res.data);
  if (res.status === 200 && validated.success) return validated.data;

  const res2 = await axios.get(`${lcdEndpoint}/wasm/v1beta1/params`);
  const validated2 = zUploadAccessParamsSubspaceLcd.safeParse(res2.data);
  if (res2.status === 200 && validated2.success) return validated2.data;
  throw new Error("Failed to fetch upload access params");
};

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
