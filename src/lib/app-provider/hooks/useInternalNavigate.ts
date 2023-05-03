import { useRouter } from "next/router";
import type { Router } from "next/router";
import type { ParsedUrlQueryInput } from "node:querystring";
import { useCallback } from "react";

import { SUPPORTED_CHAIN_IDS } from "env";
import { getFirstQueryParam } from "lib/utils";

interface NavigationArgs {
  pathname: string;
  query?: ParsedUrlQueryInput;
  options?: Parameters<Pick<Router, "push">["push"]>[2];
  replace?: boolean;
}

export const useInternalNavigate = () => {
  const router = useRouter();
  const defaultChainId = SUPPORTED_CHAIN_IDS[0] ?? "";

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
              : defaultChainId,
            ...query,
          },
        },
        undefined,
        options
      );
    },
    [defaultChainId, router]
  );
};
