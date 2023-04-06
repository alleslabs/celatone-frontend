import { useMemo } from "react";

import type { Addr, ProposalType, Option } from "lib/types";
import { ProposalStatus } from "lib/types";

export const useProposalListExpression = (
  statuses: ProposalStatus[],
  types: ProposalType[],
  search: string,
  proposer: Option<Addr>
) => {
  const parseSearch = parseInt(search, 10);
  const parseStatuses = statuses.map((status) =>
    status === ProposalStatus.DEPOSIT_FAILED ? "Inactive" : status
  );
  return useMemo(
    () => ({
      account: { address: proposer ? { _eq: proposer } : {} },
      status: statuses.length ? { _in: parseStatuses } : {},
      type: types.length ? { _in: types } : {},
      _or: [
        {
          title: search ? { _regex: search } : {},
        },
        { id: parseSearch ? { _eq: parseSearch } : {} },
      ],
    }),
    [parseSearch, parseStatuses, proposer, search, statuses.length, types]
  );
};
