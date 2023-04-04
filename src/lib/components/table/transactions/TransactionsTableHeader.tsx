import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const TransactionsTableHeader = ({
  templateColumns,
  showRelations,
  showAction,
}: {
  templateColumns: GridProps["templateColumns"];
  showRelations: boolean;
  showAction: boolean;
}) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader borderTopStyle="none">Transaction Hash</TableHeader>
    <TableHeader />
    <TableHeader>Messages</TableHeader>
    {showRelations && <TableHeader>Relations</TableHeader>}
    <TableHeader>Sender</TableHeader>
    <TableHeader>Block Height</TableHeader>
    <TableHeader>Timestamp</TableHeader>
    {showAction && <TableHeader />}
    <TableHeader />
  </Grid>
);
