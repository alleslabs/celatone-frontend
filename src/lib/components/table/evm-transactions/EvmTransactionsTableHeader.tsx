import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const EvmTransactionsTableHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader />
    <TableHeader>Transaction Hash</TableHeader>
    <TableHeader />
    <TableHeader>Method</TableHeader>
    <TableHeader>Sender</TableHeader>
    <TableHeader />
    <TableHeader>To</TableHeader>
    <TableHeader>Amount</TableHeader>
  </Grid>
);
