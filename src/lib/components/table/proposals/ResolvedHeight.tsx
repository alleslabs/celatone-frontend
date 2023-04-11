import { Text } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";

import type { ProposalsTableRowProps } from "./ProposalsTableRow";

export const ResolvedHeight = ({
  resolvedHeight,
  isDepositFailed,
  isDepositOrVoting,
}: {
  resolvedHeight: ProposalsTableRowProps["proposal"]["resolvedHeight"];
  isDepositFailed: boolean;
  isDepositOrVoting: boolean;
}) => {
  if (isDepositOrVoting) return <Text color="text.dark">Pending</Text>;
  if (!resolvedHeight || isDepositFailed)
    return <Text color="text.dark">N/A</Text>;
  return (
    <ExplorerLink
      type="block_height"
      value={resolvedHeight.toString()}
      showCopyOnHover
    />
  );
};
