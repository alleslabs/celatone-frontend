import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "lib/components/table";

interface BlocksTableHeaderProps {
  showProposer: boolean;
  templateColumns: GridProps["templateColumns"];
}

export const BlocksTableHeader = ({
  showProposer = true,
  templateColumns,
}: BlocksTableHeaderProps) => (
  <Grid
    sx={{ "> div": { color: "text.dark" } }}
    templateColumns={templateColumns}
  >
    <TableHeader>Block Height</TableHeader>
    <TableHeader>Block Hash</TableHeader>
    {showProposer && <TableHeader>Proposed by</TableHeader>}
    <TableHeader textAlign="center">Transactions</TableHeader>
    <TableHeader>Timestamp</TableHeader>
  </Grid>
);
