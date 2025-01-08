import type { DividerProps, GridProps } from "@chakra-ui/react";
import { Grid, Text } from "@chakra-ui/react";

import { TableHeader, TableHeaderFreeze } from "../tableComponents";
import { useTierConfig } from "lib/app-provider";

interface ProposalsTableHeaderProps {
  boxShadow: DividerProps["boxShadow"];
  templateColumns: GridProps["templateColumns"];
}

export const ProposalsTableHeader = ({
  boxShadow,
  templateColumns,
}: ProposalsTableHeaderProps) => {
  const { isFullTier } = useTierConfig();

  // TODO - Revisit split columnsWidth
  const columnsWidth = templateColumns?.toString().split(" ");

  return (
    <Grid minW="min-content" templateColumns={templateColumns}>
      <TableHeaderFreeze left="0">Proposal ID</TableHeaderFreeze>
      <TableHeaderFreeze
        left={columnsWidth && columnsWidth[0]}
        boxShadow={boxShadow}
        color="gray.800"
      >
        <Text px={4} color="text.main">
          Proposal Title/Types
        </Text>
      </TableHeaderFreeze>
      <TableHeader textAlign="center">Status</TableHeader>
      <TableHeader>Voting ends</TableHeader>
      {isFullTier && <TableHeader>Resolved Block Height</TableHeader>}
      <TableHeader>Proposed By</TableHeader>
    </Grid>
  );
};
