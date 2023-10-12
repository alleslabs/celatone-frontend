import { useMemo } from "react";

import type { Option, PoolTxFilter, TxFilters } from "lib/types";
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
  accountId,
  search,
  filters,
  isSigner,
}: {
  accountId: Option<number | null>;
  search: string;
  filters: TxFilters;
  isSigner: Option<boolean>;
}) =>
  useMemo(() => {
    const hasFilter = Object.values(filters).some((filter: boolean) => filter);
    const accountExp = accountId ? { account_id: { _eq: accountId } } : {};
    const isSignerExp =
      isSigner === undefined ? {} : { is_signer: { _eq: isSigner } };
    const filterExp =
      hasFilter || search
        ? {
            transaction: {
              ...(hasFilter ? generateActionsFilter(filters) : {}),
              ...(search
                ? { _or: generateSearch(search.toLocaleLowerCase()) }
                : {}),
            },
          }
        : {};
    return {
      ...accountExp,
      ...isSignerExp,
      ...filterExp,
    };
  }, [accountId, filters, isSigner, search]);

export const usePoolTxExpression = (
  poolId: Option<number>,
  type: PoolTxFilter
) =>
  useMemo(
    () => ({
      ...(poolId ? { pool_id: { _eq: poolId } } : {}),
      ...(type !== "is_all" ? { [type]: { _eq: true } } : {}),
    }),
    [poolId, type]
  );
