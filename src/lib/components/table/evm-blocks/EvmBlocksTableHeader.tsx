import type { GridProps } from "@chakra-ui/react";

import { Grid } from "@chakra-ui/react";
import { TableHeader } from "lib/components/table";

interface EvmBlocksTableHeaderProps {
  templateColumns: GridProps["templateColumns"];
}

export const EvmBlocksTableHeader = ({
  templateColumns,
}: EvmBlocksTableHeaderProps) => (
  <Grid
    sx={{ "> div": { color: "text.dark" } }}
    templateColumns={templateColumns}
  >
    <TableHeader>Block height</TableHeader>
    <TableHeader>Block hash</TableHeader>
    <TableHeader>Proposed by</TableHeader>
    <TableHeader textAlign="center">EVM Txs</TableHeader>
    <TableHeader textAlign="center">Cosmos Txs</TableHeader>
    <TableHeader>Timestamp</TableHeader>
  </Grid>
);
