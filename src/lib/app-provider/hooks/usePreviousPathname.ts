import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

import type { Nullable } from "lib/types";

export const usePreviousPathname = () => {
  const { pathname } = useRouter();

  const ref = useRef<Nullable<string>>(null);

  useEffect(() => {
    ref.current = pathname;
  }, [pathname]);

  return ref.current;
};
