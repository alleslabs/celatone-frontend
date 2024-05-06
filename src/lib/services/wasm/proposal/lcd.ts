import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";

import { CELATONE_QUERY_KEYS, useLCDEndpoint } from "lib/app-provider";
import type { Option, ProposalStatus } from "lib/types";
import { parseWithError } from "lib/utils";

import type { ProposalsResponseItemLcd, ProposalsResponseLcd } from "./types";
import { zProposalsResponseItemLcd, zProposalsResponseLcd } from "./types";

const getProposalsLcd = async (
  endpoint: string,
  paginationKey: Option<string>,
  statuses?: Omit<ProposalStatus, "DEPOSIT_FAILED" | "CANCELLED">
): Promise<ProposalsResponseLcd> =>
  axios
    .get(`${endpoint}/cosmos/gov/v1/proposals`, {
      params: {
        "pagination.limit": 10,
        "pagination.reverse": true,
        "pagination.key": paginationKey,
        ...(statuses && { proposal_status: `PROPOSAL_STATUS_${statuses}` }),
      },
    })
    .then(({ data }) => parseWithError(zProposalsResponseLcd, data));

export const useProposalsLcd = (
  statuses?: Omit<ProposalStatus, "DEPOSIT_FAILED" | "CANCELLED">
) => {
  const lcdEndpoint = useLCDEndpoint();

  const query = useInfiniteQuery<ProposalsResponseLcd>(
    [CELATONE_QUERY_KEYS.PROPOSALS_LCD, lcdEndpoint, statuses],
    ({ pageParam }) => getProposalsLcd(lcdEndpoint, pageParam, statuses),
    {
      getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
      refetchOnWindowFocus: false,
    }
  );

  const { data, ...rest } = query;

  return {
    data: data?.pages.flatMap((page) => page.proposals),
    ...rest,
  };
};

const getProposalDataLcd = async (
  endpoint: string,
  id: string
): Promise<ProposalsResponseItemLcd> =>
  axios
    .get(`${endpoint}/cosmos/gov/v1/proposals/${id}`)
    .then(({ data }) =>
      parseWithError(zProposalsResponseItemLcd, data.proposal)
    );

export const useProposalDataLcd = (id: string, enabled = true) => {
  const lcdEndpoint = useLCDEndpoint();

  return useQuery<ProposalsResponseItemLcd>(
    [CELATONE_QUERY_KEYS.PROPOSAL_DATA_LCD, lcdEndpoint, id],
    async () => getProposalDataLcd(lcdEndpoint, id),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled,
    }
  );
};
