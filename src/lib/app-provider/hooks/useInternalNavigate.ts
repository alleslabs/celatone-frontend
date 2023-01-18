import { useRouter } from "next/router";
import { useCallback } from "react";

import type { Dict } from "lib/types";

interface TransitionOptions {
  shallow?: boolean;
  locale?: string | false;
  scroll?: boolean;
  unstable_skipClientCache?: boolean;
}

interface NavigationArgs {
  pathname: string;
  query?: Dict<string, string | number>;
  options?: TransitionOptions;
}

export const useInternalNavigate = () => {
  const router = useRouter();

  return useCallback(
    ({ pathname, query = {}, options = {} }: NavigationArgs) => {
      router.push(
        {
          pathname: `/[network]${pathname}`,
          query: {
            network: router.query.network === "mainnet" ? "mainnet" : "testnet",
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
