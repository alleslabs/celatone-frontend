import { useWallet } from "@cosmos-kit/react";

import type { ProposalStatus, ProposalType } from "lib/types";

export const useProposalListExpression = (
  statuses: ProposalStatus[],
  types: ProposalType[],
  search: string,
  isMyProposal: boolean
) => {
  const { address } = useWallet();
  const parseSearch = parseInt(search, 10);
  return {
    account: { address: isMyProposal && address ? { _eq: address } : {} },
    status: statuses.length ? { _in: statuses } : {},
    type: types.length ? { _in: types } : {},
    _or: [
      {
        title: search ? { _regex: search } : {},
      },
      { id: parseSearch ? { _eq: parseSearch } : {} },
    ],
  };
};
