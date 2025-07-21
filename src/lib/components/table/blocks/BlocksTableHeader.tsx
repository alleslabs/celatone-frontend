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
    <TableHeader>Block height</TableHeader>
    <TableHeader>Block hash</TableHeader>
    {showProposer && <TableHeader>Proposed by</TableHeader>}
    <TableHeader textAlign="center">EVM Txs</TableHeader>
    <TableHeader textAlign="center">Cosmos Txs</TableHeader>
    <TableHeader>Timestamp</TableHeader>
  </Grid>
);
