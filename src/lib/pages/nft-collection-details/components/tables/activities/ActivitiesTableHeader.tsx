import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "lib/components/table";

export const ActivitiesTableHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid minW="min-content" templateColumns={templateColumns}>
    <TableHeader>Tx Hash</TableHeader>
    <TableHeader>Token Id</TableHeader>
    <TableHeader>Event</TableHeader>
    <TableHeader>Timestamp</TableHeader>
  </Grid>
);
