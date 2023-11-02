import type { NavigationArgs } from "lib/app-provider";
import type { PublicAccount } from "lib/types";

export const getNavigationArgs = (
  accountInfo: PublicAccount
): NavigationArgs => {
  switch (accountInfo.type) {
    case "account":
      return {
        pathname: "/accounts/[accountAddress]",
        query: { accountAddress: accountInfo.address },
      };
    case "contract":
      return {
        pathname: "/contracts/[accountAddress]",
        query: { accountAddress: accountInfo.address },
      };
    default:
      return {
        pathname: "",
      };
  }
};
