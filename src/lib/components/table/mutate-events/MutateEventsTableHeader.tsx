import type { GridProps } from "@chakra-ui/react";

import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const MutateEventsTableHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid minW="min-content" templateColumns={templateColumns}>
    <TableHeader>Field name</TableHeader>
    <TableHeader>Old value</TableHeader>
    <TableHeader />
    <TableHeader>New value</TableHeader>
    <TableHeader>Timestamp</TableHeader>
    <TableHeader>Remark</TableHeader>
  </Grid>
);
