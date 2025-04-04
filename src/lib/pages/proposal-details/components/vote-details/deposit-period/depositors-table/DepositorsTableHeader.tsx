import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "lib/components/table";

interface DepositorsTableHeaderProps {
  templateColumns: GridProps["templateColumns"];
  showTransaction: boolean;
}

export const DepositorsTableHeader = ({
  templateColumns,
  showTransaction,
}: DepositorsTableHeaderProps) => (
  <Grid templateColumns={templateColumns} minW="min-content">
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
