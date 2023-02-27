import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const TransactionsTableHeader = ({
  templateColumns,
  showSender,
}: {
  templateColumns: GridProps["templateColumns"];
  showSender: boolean;
}) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader borderTopStyle="none">Transaction Hash</TableHeader>
    <TableHeader />
    <TableHeader>Messages</TableHeader>
    {showSender && <TableHeader>Sender</TableHeader>}
    <TableHeader>Timestamp</TableHeader>
    <TableHeader />
  </Grid>
);
