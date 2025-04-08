import { Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";

import type { ProposalsTableRowProps } from "./ProposalsTableRow";

export const ResolvedHeight = ({
  resolvedHeight,
  isDepositOrVoting,
  amptrackSection,
}: {
  resolvedHeight: ProposalsTableRowProps["proposal"]["resolvedHeight"];
  isDepositOrVoting: boolean;
  amptrackSection?: string;
}) => {
  if (isDepositOrVoting)
    return (
      <Text color="text.dark" variant="body2">
        Pending
      </Text>
    );
  if (!resolvedHeight)
    return (
      <Text color="text.dark" variant="body2">
        N/A
      </Text>
    );
  return (
    <ExplorerLink
      ampCopierSection={amptrackSection}
      showCopyOnHover
      textVariant="body2"
      type="block_height"
      value={resolvedHeight.toString()}
    />
  );
};
