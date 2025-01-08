import { Grid, Text } from "@chakra-ui/react";
import type { DividerProps, GridProps } from "@chakra-ui/react";

import { TableHeader, TableHeaderFreeze } from "lib/components/table";

interface VotedProposalsTableHeaderProps {
  boxShadow: DividerProps["boxShadow"];
  templateColumns: GridProps["templateColumns"];
}

export const VotedProposalsTableHeader = ({
  boxShadow,
  templateColumns,
}: VotedProposalsTableHeaderProps) => (
  <Grid minW="min-content" templateColumns={templateColumns}>
    <TableHeaderFreeze left="0">Proposal ID</TableHeaderFreeze>
    <TableHeaderFreeze
      left={templateColumns?.toString().split(" ")[0]}
      boxShadow={boxShadow}
      color="gray.800"
    >
      <Text px={4} color="text.main">
        Proposal Title/Types
      </Text>
    </TableHeaderFreeze>
    <TableHeader textAlign="center">Proposal Status</TableHeader>
    <TableHeader>Vote Answer</TableHeader>
    <TableHeader>Voted On</TableHeader>
  </Grid>
);
