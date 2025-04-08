import type { DividerProps, GridProps } from "@chakra-ui/react";

import { Grid, Text } from "@chakra-ui/react";
import { useTierConfig } from "lib/app-provider";

import { TableHeader, TableHeaderFreeze } from "../tableComponents";

interface ProposalsTableHeaderProps {
  templateColumns: GridProps["templateColumns"];
  boxShadow: DividerProps["boxShadow"];
}

export const ProposalsTableHeader = ({
  templateColumns,
  boxShadow,
}: ProposalsTableHeaderProps) => {
  const { isFullTier } = useTierConfig();

  // TODO - Revisit split columnsWidth
  const columnsWidth = templateColumns?.toString().split(" ");

  return (
    <Grid minW="min-content" templateColumns={templateColumns}>
      <TableHeaderFreeze left="0">Proposal ID</TableHeaderFreeze>
      <TableHeaderFreeze
        boxShadow={boxShadow}
        color="gray.800"
        left={columnsWidth && columnsWidth[0]}
      >
        <Text color="text.main" px={4}>
          Proposal title/types
        </Text>
      </TableHeaderFreeze>
      <TableHeader textAlign="center">Status</TableHeader>
      <TableHeader>Voting ends</TableHeader>
      {isFullTier && <TableHeader>Resolved block height</TableHeader>}
      <TableHeader>Proposed by</TableHeader>
    </Grid>
  );
};
