import type { FlexProps } from "@chakra-ui/react";

import { EmptyState } from "./EmptyState";

interface ErrorFetchingProps {
  dataName: string;
  hasBorderTop?: boolean;
  my?: FlexProps["my"];
  py?: FlexProps["py"];
  withBorder?: boolean;
}

export const ErrorFetching = ({
  dataName,
  hasBorderTop = true,
  my = 12,
  py = 8,
  withBorder = false,
}: ErrorFetchingProps) => (
  <EmptyState
    imageVariant="error"
    message={`There is an error during fetching ${dataName}. Please try again later.`}
    my={my}
    py={py}
    hasBorderTop={hasBorderTop}
    withBorder={withBorder}
  />
);
