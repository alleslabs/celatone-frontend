import type { GridProps } from "@chakra-ui/react";

import { Grid } from "@chakra-ui/react";
import { TableHeader } from "lib/components/table";

interface DepositorsTableHeaderProps {
  showTransaction: boolean;
  templateColumns: GridProps["templateColumns"];
}

export const DepositorsTableHeader = ({
  showTransaction,
  templateColumns,
}: DepositorsTableHeaderProps) => (
  <Grid minW="min-content" templateColumns={templateColumns}>
    <TableHeader>Depositor</TableHeader>
    {showTransaction && (
      <>
        <TableHeader>Transaction hash</TableHeader>
        <TableHeader>Timestamp</TableHeader>
      </>
    )}
    <TableHeader>Deposited amount</TableHeader>
  </Grid>
);
