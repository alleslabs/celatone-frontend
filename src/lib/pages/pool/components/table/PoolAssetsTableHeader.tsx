import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "lib/components/table/tableComponents";
import type { PoolDetail } from "lib/types";

interface PoolHeaderProps {
  pool_type: PoolDetail["type"];
  templateColumns: GridProps["templateColumns"];
}

export const PoolAssetsTableHeader = ({
  pool_type,
  templateColumns,
}: PoolHeaderProps) => (
  <Grid templateColumns={templateColumns}>
    <TableHeader>Asset</TableHeader>

    <TableHeader textAlign="right">
      {pool_type === "Stableswap" ? "Scaling Factor" : "Weight (%)"}
    </TableHeader>
    <TableHeader textAlign="right">Value Allocation</TableHeader>
    <TableHeader textAlign="right">Amount</TableHeader>
  </Grid>
);
