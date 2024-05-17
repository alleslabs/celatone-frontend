import type { DividerProps, GridProps } from "@chakra-ui/react";
import { Grid, Text } from "@chakra-ui/react";

import { TableHeader, TableHeaderFreeze } from "../tableComponents";
import { useTierConfig } from "lib/app-provider";

interface ProposalsTableHeaderProps {
  templateColumns: GridProps["templateColumns"];
  boxShadow: DividerProps["boxShadow"];
}

export const ProposalsTableHeader = ({
  templateColumns,
  boxShadow,
}: ProposalsTableHeaderProps) => {
  const isFullTier = useTierConfig() === "full";

  // TODO - Revisit split columnsWidth
  const columnsWidth = templateColumns?.toString().split(" ");

  return (
    <Grid templateColumns={templateColumns} minW="min-content">
      <TableHeaderFreeze left="0">Proposal ID</TableHeaderFreeze>
      <TableHeaderFreeze
        left={columnsWidth && columnsWidth[0]}
        boxShadow={boxShadow}
        color="gray.800"
      >
        <Text color="text.main" px={4}>
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
