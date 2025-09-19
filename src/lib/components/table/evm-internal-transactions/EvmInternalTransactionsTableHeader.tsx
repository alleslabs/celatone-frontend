import type { GridProps } from "@chakra-ui/react";

import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

interface EvmInternalTransactionsTableHeaderProps {
  showParentHash?: boolean;
  templateColumns: GridProps["templateColumns"];
}

export const EvmInternalTransactionsTableHeader = ({
  showParentHash = true,
  templateColumns,
}: EvmInternalTransactionsTableHeaderProps) => (
  <Grid
    minW="min-content"
    sx={{
      "> div": {
        paddingLeft: 0,
        paddingRight: 0,
      },
    }}
    templateColumns={templateColumns}
  >
    {showParentHash && <TableHeader>Parent tx hash</TableHeader>}
    <TableHeader>From</TableHeader>
    <TableHeader />
    <TableHeader>To</TableHeader>
    <TableHeader>Action type</TableHeader>
    <TableHeader>Amount</TableHeader>
    <TableHeader>Gas limit</TableHeader>
    <TableHeader />
  </Grid>
);
