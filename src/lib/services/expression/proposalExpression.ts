import { useMemo } from "react";

import type { BechAddr, ProposalType, Option } from "lib/types";
import { ProposalStatus } from "lib/types";

export const useProposalListExpression = (
  statuses: ProposalStatus[],
  types: ProposalType[],
  search: string,
  proposer: Option<BechAddr>
) => {
  const parseSearch = parseInt(search, 10);
  const parseStatuses = statuses.map((status) =>
    status === ProposalStatus.DEPOSIT_FAILED ? "Inactive" : status
  );

  return useMemo(() => {
    const account = proposer ? { account: { address: { _eq: proposer } } } : {};
    const status = statuses.length ? { status: { _in: parseStatuses } } : {};
    const type = types.length ? { type: { _in: types } } : {};
    const or = {
      _or: [
        {
          title: search ? { _iregex: search } : {},
        },
        ...(parseSearch ? [{ id: { _eq: parseSearch } }] : []),
      ],
    };
    return { ...account, ...status, ...type, ...or };
  }, [parseSearch, parseStatuses, proposer, search, statuses.length, types]);
};
