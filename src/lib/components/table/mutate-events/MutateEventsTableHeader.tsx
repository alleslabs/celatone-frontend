import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const MutateEventsTableHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader>Field Name</TableHeader>
    <TableHeader>Old Value</TableHeader>
    <TableHeader />
    <TableHeader>New Value</TableHeader>
    <TableHeader>Timestamp</TableHeader>
    <TableHeader>Remark</TableHeader>
  </Grid>
);
