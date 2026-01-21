import type { GridProps } from "@chakra-ui/react";

import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const HoldersTableHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid minW="min-content" templateColumns={templateColumns}>
    <TableHeader textAlign="center">Rank</TableHeader>
    <TableHeader>Holder address</TableHeader>
    <TableHeader textAlign="left">Quantity</TableHeader>
    <TableHeader textAlign="left">Percentage</TableHeader>
  </Grid>
);
