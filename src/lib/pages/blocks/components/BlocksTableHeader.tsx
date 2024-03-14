import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "lib/components/table";

interface BlocksTableHeaderProps {
  templateColumns: GridProps["templateColumns"];
  scrollComponentId: string;
  hideProposer?: boolean;
}

export const BlocksTableHeader = ({
  templateColumns,
  scrollComponentId,
  hideProposer = false,
}: BlocksTableHeaderProps) => (
  <Grid
    templateColumns={templateColumns}
    id={scrollComponentId}
    sx={{ "> div": { color: "text.dark" } }}
  >
    <TableHeader>Block Height</TableHeader>
    <TableHeader>Block Hash</TableHeader>
    {!hideProposer && <TableHeader>Proposed by</TableHeader>}
    <TableHeader textAlign="center">Transactions</TableHeader>
    <TableHeader>Timestamp</TableHeader>
  </Grid>
);
