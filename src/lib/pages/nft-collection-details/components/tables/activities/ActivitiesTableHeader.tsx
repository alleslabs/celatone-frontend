import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "lib/components/table";

export const ActivitiesTableHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader>Tx hash</TableHeader>
    <TableHeader>Token ID</TableHeader>
    <TableHeader>Event</TableHeader>
    <TableHeader>Timestamp</TableHeader>
  </Grid>
);
