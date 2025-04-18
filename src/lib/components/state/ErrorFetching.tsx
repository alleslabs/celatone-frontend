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
  hasBorderTop = true,
  my = 12,
  py = 8,
  withBorder = false,
}: ErrorFetchingProps) => (
  <EmptyState
    hasBorderTop={hasBorderTop}
    imageVariant="error"
    message={`There is an error during fetching ${dataName}. Please try again later.`}
    my={my}
    py={py}
    withBorder={withBorder}
  />
);
