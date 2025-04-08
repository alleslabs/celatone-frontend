import { Grid } from "@chakra-ui/react";

import { TableHeader } from "lib/components/table";

interface DelegationRelatedTxsTableHeaderProps {
  templateColumns: string;
}

export const DelegationRelatedTxsTableHeader = ({
  templateColumns,
}: DelegationRelatedTxsTableHeaderProps) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader>Transaction hash</TableHeader>
    <TableHeader>Sender</TableHeader>
    <TableHeader>Action</TableHeader>
    <TableHeader w="100%" textAlign="end">
      Bonded token changes
    </TableHeader>
    <TableHeader>Timestamp</TableHeader>
  </Grid>
);
