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
  <Grid minW="min-content" templateColumns={templateColumns}>
    <TableHeader />
    <TableHeader>Transaction Hash</TableHeader>
    {showSuccess && <TableHeader />}
    <TableHeader>Messages</TableHeader>
    {showRelations && <TableHeader>Relations</TableHeader>}
    <TableHeader>Sender</TableHeader>
    {showTimestamp && <TableHeader>Timestamp</TableHeader>}
    {showAction && <TableHeader />}
  </Grid>
);
