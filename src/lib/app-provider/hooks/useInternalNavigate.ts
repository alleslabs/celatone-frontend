import { useRouter } from "next/router";
import type { Router } from "next/router";
import type { ParsedUrlQueryInput } from "node:querystring";
import { useCallback } from "react";

import { FALLBACK_SUPPORTED_CHAIN_ID } from "env";
import { getFirstQueryParam } from "lib/utils";

import { useChainConfigs } from "./useChainConfigs";

export interface NavigationArgs {
  pathname: string;
  query?: ParsedUrlQueryInput;
  options?: Parameters<Pick<Router, "push">["push"]>[2];
  replace?: boolean;
}

export const useInternalNavigate = () => {
  const router = useRouter();
  const { chainConfigs } = useChainConfigs();

  return useCallback(
    ({
      pathname,
      query = {},
      options = {},
      replace = false,
    }: NavigationArgs) => {
      const routerFn = replace ? router.replace : router.push;
      const network = getFirstQueryParam(router.query.network);

      let networkRoute = FALLBACK_SUPPORTED_CHAIN_ID;
      if (network in chainConfigs) networkRoute = network;
      if (
        !(network in chainConfigs) &&
        Object.values(chainConfigs).length > 0
      ) {
        const [chain] = Object.keys(chainConfigs);
        networkRoute = chain;
      }

      routerFn(
        {
          pathname: `/[network]${pathname}`,
          query: {
            ...query,
            network: networkRoute,
          },
        },
        undefined,
        options
      );
    },
    [router.push, router.query.network, router.replace, chainConfigs]
  );
};
