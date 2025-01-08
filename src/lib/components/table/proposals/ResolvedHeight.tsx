import { Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";

import type { ProposalsTableRowProps } from "./ProposalsTableRow";

export const ResolvedHeight = ({
  amptrackSection,
  isDepositOrVoting,
  resolvedHeight,
}: {
  amptrackSection?: string;
  isDepositOrVoting: boolean;
  resolvedHeight: ProposalsTableRowProps["proposal"]["resolvedHeight"];
}) => {
  if (isDepositOrVoting)
    return (
      <Text variant="body2" color="text.dark">
        Pending
      </Text>
    );
  if (!resolvedHeight)
    return (
      <Text variant="body2" color="text.dark">
        N/A
      </Text>
    );
  return (
    <ExplorerLink
      textVariant="body2"
      type="block_height"
      value={resolvedHeight.toString()}
      ampCopierSection={amptrackSection}
      showCopyOnHover
    />
  );
};
