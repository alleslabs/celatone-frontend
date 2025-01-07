import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

interface EvmTransactionsTableHeaderProps {
  showTimestamp: boolean;
  templateColumns: GridProps["templateColumns"];
}

export const EvmTransactionsTableHeader = ({
  showTimestamp,
  templateColumns,
}: EvmTransactionsTableHeaderProps) => (
  <Grid minW="min-content" templateColumns={templateColumns}>
    <TableHeader />
    <TableHeader>Transaction Hash</TableHeader>
    <TableHeader />
    <TableHeader>Method</TableHeader>
    <TableHeader>Sender</TableHeader>
    <TableHeader />
    <TableHeader>To</TableHeader>
    <TableHeader>Amount</TableHeader>
    {showTimestamp && <TableHeader>Timestamp</TableHeader>}
  </Grid>
);
