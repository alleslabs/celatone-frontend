import type { PropsWithChildren } from "react";

import { Spinner } from "@chakra-ui/react";

export const ComponentLoader = ({
  isLoading,
  children,
}: PropsWithChildren<{ isLoading: boolean }>) => {
  if (isLoading) return <Spinner mx="auto" size="lg" />;
  return <>{children}</>;
};
