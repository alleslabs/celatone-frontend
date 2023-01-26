import { useWallet } from "@cosmos-kit/react";
import { useCallback } from "react";

import type { CodeInfo, HumanAddr } from "lib/types";
import { InstantiatePermission } from "lib/types";

export const usePermissionFilter = (permissionValue?: string) => {
  const { address } = useWallet();
  return useCallback(
    (code: CodeInfo) => {
      const isEveryBody =
        code.instantiatePermission === InstantiatePermission.EVERYBODY;
      const isNobody =
        code.instantiatePermission === InstantiatePermission.NOBODY;
      const isInclude = code.permissionAddresses.includes(address as HumanAddr);

      switch (permissionValue) {
        case "with-proposal":
          return (!isEveryBody && !isInclude) || isNobody;
        case "without-proposal":
          return isInclude || isEveryBody;
        case "all":
        default:
          return true;
      }
    },
    [address, permissionValue]
  );
};

export const useSearchFilter = (keyword?: string) => {
  return useCallback(
    (code: CodeInfo) => {
      if (keyword === undefined) return true;
      const computedKeyword = keyword.trim();
      if (computedKeyword.length === 0) return true;

      return (
        code.id.toString().startsWith(computedKeyword) ||
        code.description?.toLowerCase().includes(computedKeyword.toLowerCase())
      );
    },
    [keyword]
  );
};
