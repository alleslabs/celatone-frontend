import type { FlexProps } from "@chakra-ui/react";

import { EmptyState } from "./EmptyState";

interface ErrorFetchingProps {
  dataName: string;
  withBorder?: boolean;
  my?: FlexProps["my"];
  py?: FlexProps["py"];
  hasBorderTop?: boolean;
}

export const ErrorFetching = ({
  dataName,
  withBorder = false,
  my = 12,
  py = 8,
  hasBorderTop = true,
}: ErrorFetchingProps) => (
  <EmptyState
    imageVariant="error"
    message={`There is an error during fetching ${dataName}. Please try again later.`}
    withBorder={withBorder}
    py={py}
    my={my}
    hasBorderTop={hasBorderTop}
  />
);
