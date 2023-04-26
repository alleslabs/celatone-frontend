import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "lib/components/table";

export const PoolTxsTableHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader>Transaction Hash</TableHeader>
    <TableHeader />
    <TableHeader>Actions</TableHeader>
    <TableHeader>Sender</TableHeader>
    <TableHeader>Timestamp</TableHeader>
    <TableHeader />
  </Grid>
);
