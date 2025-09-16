import { Grid } from "@chakra-ui/react";
import { TableHeader } from "lib/components/table";

interface BalanceChangesTableHeaderProps {
  templateColumns: string;
}

export const BalanceChangesTableHeader = ({
  templateColumns,
}: BalanceChangesTableHeaderProps) => (
  <Grid minW="min-content" templateColumns={templateColumns}>
    <TableHeader borderBottom={0} pb={2}>
      Address
    </TableHeader>
    <TableHeader borderBottom={0} pb={2}>
      Balance changes
    </TableHeader>
  </Grid>
);
