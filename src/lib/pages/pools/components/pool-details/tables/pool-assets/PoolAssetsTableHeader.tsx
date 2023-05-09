import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "lib/components/table/tableComponents";
import type { PoolDetail } from "lib/types";

interface PoolHeaderProps {
  poolType: PoolDetail["type"];
  isSupported: PoolDetail["isSupported"];
  templateColumns: GridProps["templateColumns"];
}

export const PoolAssetsTableHeader = ({
  poolType,
  isSupported,
  templateColumns,
}: PoolHeaderProps) => (
  <Grid
    templateColumns={templateColumns}
    sx={{ "> div": { color: "text.dark" } }}
  >
    <TableHeader>Asset</TableHeader>

    <TableHeader textAlign="right">
      {poolType === "Stableswap" ? "Scaling Factor" : "Weight (%)"}
    </TableHeader>
    <TableHeader textAlign="right">{isSupported && "Allocation"}</TableHeader>
    <TableHeader textAlign="right">Amount</TableHeader>
  </Grid>
);
