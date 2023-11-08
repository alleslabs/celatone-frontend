import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "../tableComponents";

export const SavedAccountsTableHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => (
  <Grid templateColumns={templateColumns} minW="min-content">
    <TableHeader>Account Address</TableHeader>
    <TableHeader>Account Name</TableHeader>
    <TableHeader>Account Description</TableHeader>
    <TableHeader />
  </Grid>
);
