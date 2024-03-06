import {
  QueryClientProvider as Provider,
  QueryClient,
} from "@tanstack/react-query";
import type { ReactNode } from "react";

export const QueryClientProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  return <Provider client={queryClient}>{children}</Provider>;
};
