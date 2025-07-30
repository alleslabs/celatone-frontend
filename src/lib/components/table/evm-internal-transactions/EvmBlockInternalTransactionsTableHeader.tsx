import type { GridProps } from "@chakra-ui/react";

import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

interface EvmBlockInternalTransactionsTableHeaderProps {
  templateColumns: GridProps["templateColumns"];
}

export const EvmBlockInternalTransactionsTableHeader = ({
  templateColumns,
}: EvmBlockInternalTransactionsTableHeaderProps) => (
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
    <TableHeader>Parent tx hash</TableHeader>
    <TableHeader>From</TableHeader>
    <TableHeader />
    <TableHeader>To</TableHeader>
    <TableHeader>Action type</TableHeader>
    <TableHeader>Amount</TableHeader>
    <TableHeader>Gas limit</TableHeader>
    <TableHeader />
  </Grid>
);
