import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const MutateEventsTableHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid minW="min-content" templateColumns={templateColumns}>
    <TableHeader>Field Name</TableHeader>
    <TableHeader>Old Value</TableHeader>
    <TableHeader />
    <TableHeader>New Value</TableHeader>
    <TableHeader>Timestamp</TableHeader>
    <TableHeader>Remark</TableHeader>
  </Grid>
);
