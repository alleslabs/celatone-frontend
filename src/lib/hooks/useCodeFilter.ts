import type { CodeInfo } from "lib/types";

import { useCurrentChain } from "lib/app-provider";
import { resolvePermission } from "lib/utils";
import { useCallback } from "react";

export type PermissionFilterValue =
  | "all"
  | "with-proposal"
  | "without-proposal";

export const useCodePermissionFilter = (filterValue: PermissionFilterValue) => {
  const { address } = useCurrentChain();
  return useCallback(
    ({ instantiatePermission, permissionAddresses }: CodeInfo) => {
      const isAllowed = resolvePermission(
        address,
        instantiatePermission,
        permissionAddresses
      );

      switch (filterValue) {
        case "with-proposal":
          return !isAllowed;
        case "without-proposal":
          return isAllowed;
        case "all":
        default:
          return true;
      }
    },
    [address, filterValue]
  );
};

export const useCodeSearchFilter = (keyword: string) =>
  useCallback(
    (code: CodeInfo) => {
      const computedKeyword = keyword.trim();
      if (!computedKeyword.length) return true;
      return (
        code.id.toString().startsWith(computedKeyword) ||
        code.name?.toLowerCase().includes(computedKeyword.toLowerCase())
      );
    },
    [keyword]
  );
