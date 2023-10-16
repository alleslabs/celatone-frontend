import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "lib/components/table";

export const NonRedelegatableTableHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader>Cannot Redelegate From</TableHeader>
    <TableHeader>Cannot Redelegate Until</TableHeader>
  </Grid>
);
