import type { GridProps } from "@chakra-ui/react";

import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const NonRedelegatableTableHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid minW="min-content" templateColumns={templateColumns}>
    <TableHeader>Cannot Redelegate From</TableHeader>
    <TableHeader>Cannot Redelegate Until</TableHeader>
  </Grid>
);
