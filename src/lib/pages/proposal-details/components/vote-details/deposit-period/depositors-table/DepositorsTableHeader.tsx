import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { TableHeader } from "lib/components/table";

interface DepositorsTableHeaderProps {
  templateColumns: GridProps["templateColumns"];
}

export const DepositorsTableHeader = ({
  templateColumns,
}: DepositorsTableHeaderProps) => {
  const isMobile = useMobile();

  if (isMobile) return null;

  return (
    <Grid templateColumns={templateColumns} minW="min-content">
      <TableHeader>Depositor</TableHeader>
      <TableHeader>Transaction Hash</TableHeader>
      <TableHeader>Timestamp</TableHeader>
      <TableHeader textAlign="right">Deposited Amount</TableHeader>
    </Grid>
  );
};
