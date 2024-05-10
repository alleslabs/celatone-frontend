import { useRouter } from "next/router";
import type { Router } from "next/router";
import type { ParsedUrlQueryInput } from "node:querystring";
import { useCallback } from "react";

import { FALLBACK_SUPPORTED_CHAIN_ID, SUPPORTED_CHAIN_IDS } from "env";
import { getFirstQueryParam } from "lib/utils";

export interface NavigationArgs {
  pathname: string;
  query?: ParsedUrlQueryInput;
  options?: Parameters<Pick<Router, "push">["push"]>[2];
  replace?: boolean;
}

export const useInternalNavigate = () => {
  const router = useRouter();

  return useCallback(
    ({
      pathname,
      query = {},
      options = {},
      replace = false,
    }: NavigationArgs) => {
      const routerFn = replace ? router.replace : router.push;
      routerFn(
        {
          pathname: `/[network]${pathname}`,
          query: {
            network: SUPPORTED_CHAIN_IDS.includes(
              getFirstQueryParam(router.query.network)
            )
              ? router.query.network
              : FALLBACK_SUPPORTED_CHAIN_ID,
            ...query,
          },
        },
        undefined,
        options
      );
    },
    [router]
  );
};
