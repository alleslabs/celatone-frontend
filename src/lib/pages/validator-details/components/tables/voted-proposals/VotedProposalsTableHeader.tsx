import type { DividerProps, GridProps } from "@chakra-ui/react";

import { Grid, Text } from "@chakra-ui/react";
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
      boxShadow={boxShadow}
      color="gray.800"
      left={templateColumns?.toString().split(" ")[0]}
    >
      <Text color="text.main" px={4}>
        Proposal title/types
      </Text>
    </TableHeaderFreeze>
    <TableHeader textAlign="center">Proposal status</TableHeader>
    <TableHeader>Vote answer</TableHeader>
    <TableHeader>Voted on</TableHeader>
  </Grid>
);
