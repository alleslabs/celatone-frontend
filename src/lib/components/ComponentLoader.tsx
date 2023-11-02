import { Spinner } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";

export const ComponentLoader = ({
  isLoading,
  children,
}: PropsWithChildren<{ isLoading: boolean }>) => {
  if (isLoading) return <Spinner size="lg" mx="auto" />;
  return <>{children}</>;
};
