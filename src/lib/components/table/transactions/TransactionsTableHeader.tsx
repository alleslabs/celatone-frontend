import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const TransactionsTableHeader = ({
  templateColumns,
  showSuccess,
  showRelations,
  showTimestamp,
  showAction,
}: {
  templateColumns: GridProps["templateColumns"];
  showSuccess: boolean;
  showRelations: boolean;
  showTimestamp: boolean;
  showAction: boolean;
}) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader />
    <TableHeader>Transaction hash</TableHeader>
    {showSuccess && <TableHeader />}
    <TableHeader>Messages</TableHeader>
    {showRelations && <TableHeader>Relations</TableHeader>}
    <TableHeader>Sender</TableHeader>
    {showTimestamp && <TableHeader>Timestamp</TableHeader>}
    {showAction && <TableHeader />}
  </Grid>
);
