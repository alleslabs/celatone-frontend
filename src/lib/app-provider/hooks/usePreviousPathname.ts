import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

export const usePreviousPathname = () => {
  const { pathname } = useRouter();

  const ref = useRef<string | null>(null);

  useEffect(() => {
    ref.current = pathname;
  }, [pathname]);

  return ref.current;
};
