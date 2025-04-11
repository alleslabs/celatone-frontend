import type { GridProps } from "@chakra-ui/react";

import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

interface EvmTransactionsTableHeaderProps {
  templateColumns: GridProps["templateColumns"];
  showTimestamp: boolean;
}

export const EvmTransactionsTableHeader = ({
  templateColumns,
  showTimestamp,
}: EvmTransactionsTableHeaderProps) => (
  <Grid minW="min-content" templateColumns={templateColumns}>
    <TableHeader />
    <TableHeader>Transaction hash</TableHeader>
    <TableHeader />
    <TableHeader>Method</TableHeader>
    <TableHeader>Sender</TableHeader>
    <TableHeader />
    <TableHeader>To</TableHeader>
    <TableHeader>Amount</TableHeader>
    {showTimestamp && <TableHeader>Timestamp</TableHeader>}
  </Grid>
);
