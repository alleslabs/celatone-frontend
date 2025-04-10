import { Grid } from "@chakra-ui/react";
import { TableHeader } from "lib/components/table";

interface DelegationRelatedTxsTableHeaderProps {
  templateColumns: string;
}

export const DelegationRelatedTxsTableHeader = ({
  templateColumns,
}: DelegationRelatedTxsTableHeaderProps) => (
  <Grid minW="min-content" templateColumns={templateColumns}>
    <TableHeader>Transaction hash</TableHeader>
    <TableHeader>Sender</TableHeader>
    <TableHeader>Action</TableHeader>
    <TableHeader textAlign="end" w="100%">
      Bonded token changes
    </TableHeader>
    <TableHeader>Timestamp</TableHeader>
  </Grid>
);
