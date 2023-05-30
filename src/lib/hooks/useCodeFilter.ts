import { useWallet } from "@cosmos-kit/react";
import { useCallback } from "react";

import type { CodeInfo, HumanAddr } from "lib/types";
import { AccessConfigPermission } from "lib/types";

export type PermissionFilterValue =
  | "all"
  | "without-proposal"
  | "with-proposal";

export const useCodePermissionFilter = (filterValue: PermissionFilterValue) => {
  const { address } = useWallet();
  return useCallback(
    ({ instantiatePermission, permissionAddresses }: CodeInfo) => {
      const isAllowed =
        permissionAddresses.includes(address as HumanAddr) ||
        instantiatePermission === AccessConfigPermission.EVERYBODY;

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
