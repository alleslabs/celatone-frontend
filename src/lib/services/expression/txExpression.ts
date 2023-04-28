import { useMemo } from "react";

import type { Addr, Option, TxFilters } from "lib/types";
import { isTxHash } from "lib/utils";

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
        { hash: { _eq: isTxHash(search) ? `\\x${search}` : "" } },
        { contract_transactions: { contract: { address: { _eq: search } } } },
      ]
    : [{}];

export const useTxExpression = ({
  address,
  accountId,
  search,
  filters,
  isSigner,
}: {
  address?: Option<Addr>;
  accountId?: Option<number>;
  search: string;
  filters: TxFilters;
  isSigner: Option<boolean>;
}) =>
  useMemo(() => {
    const hasFilter = Object.values(filters).some((filter: boolean) => filter);
    return {
      ...(accountId
        ? { account_id: { _eq: accountId } }
        : { ...(address ? { account: { address: { _eq: address } } } : {}) }),
      ...(isSigner === undefined ? {} : { is_signer: { _eq: isSigner } }),
      ...(hasFilter || search
        ? {
            transaction: {
              ...(hasFilter ? generateActionsFilter(filters) : {}),
              ...(search
                ? { _or: generateSearch(search.toLocaleLowerCase()) }
                : {}),
            },
          }
        : {}),
    };
  }, [address, accountId, filters, isSigner, search]);
