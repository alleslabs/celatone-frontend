import type { GridProps } from "@chakra-ui/react";

import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

interface EvmTransactionsTableHeaderProps {
  templateColumns: GridProps["templateColumns"];
}

export const EvmTransactionsTableHeader = ({
  templateColumns,
}: EvmTransactionsTableHeaderProps) => (
  <Grid minW="min-content" templateColumns={templateColumns}>
    <TableHeader>Tx hash</TableHeader>
    <TableHeader>Action</TableHeader>
    <TableHeader>Sender</TableHeader>
    <TableHeader>Amount</TableHeader>
  </Grid>
);
