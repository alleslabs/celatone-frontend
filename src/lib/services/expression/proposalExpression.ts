import { useMemo } from "react";

import type { Addr, ProposalStatus, ProposalType, Option } from "lib/types";

export const useProposalListExpression = (
  statuses: ProposalStatus[],
  types: ProposalType[],
  search: string,
  proposer: Option<Addr>
) => {
  const parseSearch = parseInt(search, 10);
  return useMemo(
    () => ({
      account: { address: proposer ? { _eq: proposer } : {} },
      status: statuses.length ? { _in: statuses } : {},
      type: types.length ? { _in: types } : {},
      _or: [
        {
          title: search ? { _regex: search } : {},
        },
        { id: parseSearch ? { _eq: parseSearch } : {} },
      ],
    }),
    [parseSearch, proposer, search, statuses, types]
  );
};
