import { useMemo } from "react";

import type { Addr, Option, TxFilters } from "lib/types";

const actions = {
  isExecute: "is_execute",
  isInstantiate: "is_instantiate",
  isUpload: "is_store_code",
  isIbc: "is_ibc",
  isSend: "is_send",
  isMigrate: "is_migrate",
  isUpdateAdmin: "is_update_admin",
  isClearAdmin: "is_clear_admin",
};

const generateActionsFilter = (filters: TxFilters) =>
  Object.keys(filters).reduce(
    (acc: Record<string, { _eq: boolean }>, key: string) => {
      const k = key as keyof TxFilters;
      if (filters[k]) {
        acc[actions[k]] = { _eq: true };
      }
      return acc;
    },
    {}
  );

const generateSearch = (search: string) =>
  search
    ? [
        { hash: { _eq: `\\\\${search}` } },
        { contracts: { address: { _eq: search } } },
      ]
    : [{}];

export const useTxExpression = (
  address: Option<Addr>,
  search: string,
  filters: TxFilters,
  relation: Option<boolean>
) =>
  useMemo(
    () => ({
      account: { address: address ? { _eq: address } : {} },
      is_signer: relation === undefined ? {} : { _eq: relation },
      transaction: {
        ...generateActionsFilter(filters),
        _and: [{ _or: generateSearch(search) }],
      },
    }),
    [address, filters, relation, search]
  );
