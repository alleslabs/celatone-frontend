import { Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";

import type { ProposalsTableRowProps } from "./ProposalsTableRow";

export const ResolvedHeight = ({
  resolvedHeight,
  isDepositFailed,
  isDepositOrVoting,
  amptrackSection,
}: {
  resolvedHeight: ProposalsTableRowProps["proposal"]["resolvedHeight"];
  isDepositFailed: boolean;
  isDepositOrVoting: boolean;
  amptrackSection?: string;
}) => {
  if (isDepositOrVoting)
    return (
      <Text color="text.dark" variant="body2">
        Pending
      </Text>
    );
  if (!resolvedHeight || isDepositFailed)
    return (
      <Text color="text.dark" variant="body2">
        N/A
      </Text>
    );
  return (
    <ExplorerLink
      type="block_height"
      value={resolvedHeight.toString()}
      showCopyOnHover
      ampCopierSection={amptrackSection}
      textVariant="body2"
    />
  );
};
