import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "lib/components/table";

interface BlocksTableHeaderProps {
  templateColumns: GridProps["templateColumns"];
  scrollComponentId: string;
}

export const BlocksTableHeader = ({
  templateColumns,
  scrollComponentId,
}: BlocksTableHeaderProps) => (
  <Grid
    templateColumns={templateColumns}
    id={scrollComponentId}
    sx={{ "> div": { color: "text.dark" } }}
  >
    <TableHeader>Block Height</TableHeader>
    <TableHeader>Block Hash</TableHeader>
    <TableHeader>Proposed by</TableHeader>
    <TableHeader textAlign="center">Transactions</TableHeader>
    <TableHeader>Timestamp</TableHeader>
  </Grid>
);
