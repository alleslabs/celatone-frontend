import { useWallet } from "@cosmos-kit/react";
import { useCallback } from "react";

import type { CodeInfo, HumanAddr } from "lib/types";
import { resolvePermission } from "lib/utils";

export type PermissionFilterValue =
  | "all"
  | "without-proposal"
  | "with-proposal";

export const usePermissionFilter = (filterValue: PermissionFilterValue) => {
  const { address } = useWallet();
  return useCallback(
    ({ instantiatePermission, permissionAddresses }: CodeInfo) => {
      const isAllowed = resolvePermission(
        address as HumanAddr,
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

export const useSearchFilter = (keyword: string) =>
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
