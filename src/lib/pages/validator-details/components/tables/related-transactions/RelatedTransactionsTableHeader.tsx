import { Grid } from "@chakra-ui/react";

import { TableHeader } from "lib/components/table";

interface RelatedTransactionsTableHeaderProps {
  templateColumns: string;
}

export const RelatedTransactionsTableHeader = ({
  templateColumns,
}: RelatedTransactionsTableHeaderProps) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader>Transaction Hash</TableHeader>
    <TableHeader>Sender</TableHeader>
    <TableHeader>Action</TableHeader>
    <TableHeader w="100%" textAlign="end">
      Bonded Token Changes
    </TableHeader>
    <TableHeader>Timestamp</TableHeader>
  </Grid>
);
