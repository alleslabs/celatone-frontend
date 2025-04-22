import type { Router } from "next/router";
import type { ParsedUrlQueryInput } from "node:querystring";

import { getFirstQueryParam } from "lib/utils";
import { useRouter } from "next/router";
import { useCallback } from "react";

import { useChainConfigs } from "./useChainConfigs";

export interface NavigationArgs {
  options?: Parameters<Pick<Router, "push">["push"]>[2];
  pathname: string;
  query?: ParsedUrlQueryInput;
  replace?: boolean;
}

export const useInternalNavigate = () => {
  const router = useRouter();
  const { supportedChainIds } = useChainConfigs();

  return useCallback(
    ({
      options = {},
      pathname,
      query = {},
      replace = false,
    }: NavigationArgs) => {
      const routerFn = replace ? router.replace : router.push;
      routerFn(
        {
          pathname: `/[network]${pathname}`,
          query: {
            network: supportedChainIds.includes(
              getFirstQueryParam(router.query.network)
            )
              ? router.query.network
              : supportedChainIds[0],
            ...query,
          },
        },
        undefined,
        options
      );
    },
    [router.push, router.query.network, router.replace, supportedChainIds]
  );
};
