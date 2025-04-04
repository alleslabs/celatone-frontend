import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const NonRedelegatableTableHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader>Cannot redelegate from</TableHeader>
    <TableHeader>Cannot redelegate until</TableHeader>
  </Grid>
);
