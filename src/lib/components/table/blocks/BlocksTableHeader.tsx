import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "lib/components/table";

interface BlocksTableHeaderProps {
  templateColumns: GridProps["templateColumns"];
  showProposer: boolean;
}

export const BlocksTableHeader = ({
  templateColumns,
  showProposer = true,
}: BlocksTableHeaderProps) => (
  <Grid
    templateColumns={templateColumns}
    sx={{ "> div": { color: "text.dark" } }}
  >
    <TableHeader>Block height</TableHeader>
    <TableHeader>Block hash</TableHeader>
    {showProposer && <TableHeader>Proposed by</TableHeader>}
    <TableHeader textAlign="center">Transactions</TableHeader>
    <TableHeader>Timestamp</TableHeader>
  </Grid>
);
