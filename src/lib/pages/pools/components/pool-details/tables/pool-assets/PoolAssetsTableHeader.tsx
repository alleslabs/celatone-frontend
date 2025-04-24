import type { GridProps } from "@chakra-ui/react";
import type { PoolData } from "lib/types";

import { Grid } from "@chakra-ui/react";
import { TableHeader } from "lib/components/table";
import { PoolType } from "lib/types";

interface PoolHeaderProps {
  isSupported: PoolData["isSupported"];
  poolType: PoolData["type"];
  templateColumns: GridProps["templateColumns"];
}

export const PoolAssetsTableHeader = ({
  isSupported,
  poolType,
  templateColumns,
}: PoolHeaderProps) => (
  <Grid
    sx={{ "> div": { color: "text.dark" } }}
    templateColumns={templateColumns}
  >
    <TableHeader>Asset</TableHeader>
    {poolType !== PoolType.COSMWASM && (
      <TableHeader textAlign="right">
        {poolType === PoolType.STABLESWAP ? "Scaling factor" : "Weight (%)"}
      </TableHeader>
    )}
    <TableHeader textAlign="right">{isSupported && "Allocation"}</TableHeader>
    <TableHeader textAlign="right">Amount</TableHeader>
  </Grid>
);
