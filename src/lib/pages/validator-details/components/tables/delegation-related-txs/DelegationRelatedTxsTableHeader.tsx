import { Grid } from "@chakra-ui/react";

import { TableHeader } from "lib/components/table";

interface DelegationRelatedTxsTableHeaderProps {
  templateColumns: string;
}

export const DelegationRelatedTxsTableHeader = ({
  templateColumns,
}: DelegationRelatedTxsTableHeaderProps) => (
  <Grid minW="min-content" templateColumns={templateColumns}>
    <TableHeader>Transaction Hash</TableHeader>
    <TableHeader>Sender</TableHeader>
    <TableHeader>Action</TableHeader>
    <TableHeader textAlign="end" w="100%">
      Bonded Token Changes
    </TableHeader>
    <TableHeader>Timestamp</TableHeader>
  </Grid>
);
