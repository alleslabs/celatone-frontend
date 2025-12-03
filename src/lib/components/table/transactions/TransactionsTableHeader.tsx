import type { GridProps } from "@chakra-ui/react";

import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const TransactionsTableHeader = ({
  showAction,
  showRelations,
  showTimestamp,
  templateColumns,
}: {
  showAction: boolean;
  showRelations: boolean;
  showTimestamp: boolean;
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid minW="min-content" templateColumns={templateColumns}>
    <TableHeader />
    <TableHeader>Transaction hash</TableHeader>
    <TableHeader>Messages</TableHeader>
    {showRelations && <TableHeader>Relations</TableHeader>}
    <TableHeader>Sender</TableHeader>
    {showTimestamp && <TableHeader>Timestamp</TableHeader>}
    {showAction && <TableHeader />}
  </Grid>
);
