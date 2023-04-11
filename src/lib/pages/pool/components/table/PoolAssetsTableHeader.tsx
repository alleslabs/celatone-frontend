import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "lib/components/table/tableComponents";

export const PoolAssetsTableHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid templateColumns={templateColumns}>
    <TableHeader>Asset</TableHeader>
    <TableHeader textAlign="right">Weight</TableHeader>
    <TableHeader textAlign="right">Allocation</TableHeader>
    <TableHeader textAlign="right">Amount</TableHeader>
  </Grid>
);
