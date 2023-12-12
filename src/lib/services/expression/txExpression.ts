import { useMemo } from "react";

import { useWasmConfig } from "lib/app-provider";
import type { Nullable, Option, PoolTxFilter, TxFilters } from "lib/types";
import { isTxHash } from "lib/utils";

const actions = {
  isSend: "is_send",
  isIbc: "is_ibc",
  isOpInit: "is_opinit",
  isExecute: "is_execute",
  isInstantiate: "is_instantiate",
  isStoreCode: "is_store_code",
  isMigrate: "is_migrate",
  isUpdateAdmin: "is_update_admin",
  isClearAdmin: "is_clear_admin",
  isMovePublish: "is_move_publish",
  isMoveUpgrade: "is_move_upgrade",
  isMoveExecute: "is_move_execute",
  isMoveScript: "is_move_script",
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

const generateSearch = ({
  search,
  wasmEnable,
}: {
  search: string;
  wasmEnable: boolean;
}) => {
  const searchExp = [];

  if (search) {
    searchExp.push({ hash: { _eq: isTxHash(search) ? `\\x${search}` : "" } });

    if (wasmEnable)
      searchExp.push({
        contract_transactions: { contract: { address: { _eq: search } } },
      });
  }

  return searchExp;
};

export const useTxExpression = ({
  accountId,
  search,
  filters,
  isSigner,
}: {
  accountId: Option<Nullable<number>>;
  search: string;
  filters: TxFilters;
  isSigner: Option<boolean>;
}) => {
  const wasmConfig = useWasmConfig({ shouldRedirect: false });

  return useMemo(() => {
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
                ? {
                    _or: generateSearch({
                      search: search.toLocaleLowerCase(),
                      wasmEnable: wasmConfig.enabled,
                    }),
                  }
                : {}),
            },
          }
        : {};
    return {
      ...accountExp,
      ...isSignerExp,
      ...filterExp,
    };
  }, [accountId, filters, isSigner, search, wasmConfig.enabled]);
};

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
