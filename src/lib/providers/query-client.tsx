import type { ReactNode } from "react";

import {
  QueryClientProvider as Provider,
  QueryClient,
} from "@tanstack/react-query";
import { useState } from "react";

export const QueryClientProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return <Provider client={queryClient}>{children}</Provider>;
};
