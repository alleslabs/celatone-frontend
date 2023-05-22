import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const TransactionsTableHeader = ({
  templateColumns,
  showRelations,
  showTimestamp,
  showAction,
}: {
  templateColumns: GridProps["templateColumns"];
  showRelations: boolean;
  showTimestamp: boolean;
  showAction: boolean;
}) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader />
    <TableHeader>Transaction Hash</TableHeader>
    <TableHeader />
    <TableHeader>Messages</TableHeader>
    {showRelations && <TableHeader>Relations</TableHeader>}
    <TableHeader>Sender</TableHeader>
    {showTimestamp && <TableHeader>Timestamp</TableHeader>}
    {showAction && <TableHeader />}
  </Grid>
);
